import { useCallback, useEffect, useRef, useState } from "react";
import type { Subscription } from "rxjs";
import { connectSmartCube, type SmartCubeConnection } from "smartcube-web-bluetooth";

const MAC_STORAGE_KEY = "smartcube-manual-mac";
const MAC_PATTERN = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;

function isMacAddressError(e: unknown): boolean {
  return (
    e instanceof Error &&
    (e.message.includes("MAC address") || e.message.includes("Bluetooth MAC address"))
  );
}

function promptForMac(): string | null {
  for (let attempt = 0; attempt < 3; attempt++) {
    const stored = localStorage.getItem(MAC_STORAGE_KEY) ?? "";
    const input = window.prompt(
      "Could not detect your cube's MAC address automatically.\n" +
        "Enter it manually (format AA:BB:CC:DD:EE:FF):",
      stored,
    );
    if (input === null) {
      return null;
    }
    const mac = input.trim().toUpperCase();
    if (MAC_PATTERN.test(mac)) {
      return mac;
    }
    window.alert("Invalid MAC address. Expected format AA:BB:CC:DD:EE:FF");
  }
  return null;
}

function makeMacProvider(mac: string) {
  return () => Promise.resolve(mac);
}

export function useSmartCube(onMove: (move: string) => void) {
  const [conn, setConn] = useState<SmartCubeConnection | null>(null);
  const connRef = useRef<SmartCubeConnection | null>(null);
  const subRef = useRef<Subscription | null>(null);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const attach = useCallback((connection: SmartCubeConnection) => {
    connRef.current = connection;
    setConn(connection);
    subRef.current?.unsubscribe();
    subRef.current = connection.events$.subscribe((event) => {
      try {
        if (event.type === "MOVE") {
          onMoveRef.current(event.move);
        } else if (event.type === "DISCONNECT") {
          subRef.current?.unsubscribe();
          subRef.current = null;
          connRef.current = null;
          setConn(null);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  const connect = useCallback(async () => {
    if (connRef.current !== null) {
      return;
    }
    if (typeof navigator === "undefined" || !("bluetooth" in navigator)) {
      window.alert("Web Bluetooth is not supported in this browser.");
      return;
    }
    const storedMac = localStorage.getItem(MAC_STORAGE_KEY);
    try {
      const connection = await connectSmartCube({
        macAddressProvider: storedMac ? makeMacProvider(storedMac) : undefined,
      });
      attach(connection);
      return;
    } catch (e) {
      console.error(e);
      if (!isMacAddressError(e)) {
        return;
      }
    }
    const mac = promptForMac();
    if (mac === null) {
      return;
    }
    localStorage.setItem(MAC_STORAGE_KEY, mac);
    try {
      const connection = await connectSmartCube({
        macAddressProvider: makeMacProvider(mac),
      });
      attach(connection);
    } catch (e) {
      console.error(e);
      window.alert("Connection failed even with the manually entered MAC address.");
    }
  }, [attach]);

  const disconnect = useCallback(() => {
    subRef.current?.unsubscribe();
    subRef.current = null;
    void connRef.current?.disconnect();
    connRef.current = null;
    setConn(null);
  }, []);

  useEffect(() => {
    return () => {
      subRef.current?.unsubscribe();
      void connRef.current?.disconnect();
    };
  }, []);

  return { conn, connect, disconnect };
}