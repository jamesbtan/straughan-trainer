import { useCallback, useSyncExternalStore } from "react";
import { INVERSE_MAP } from "./algs.ts";

export const NUM_CASES = INVERSE_MAP.length;
export const ALL_MASK = (1 << NUM_CASES) - 1;

const PARAM = "algs";

function readFromUrl(): number {
  const raw = new URLSearchParams(window.location.search).get(PARAM);
  if (raw === null) return ALL_MASK;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < 0) return ALL_MASK;
  return n & ALL_MASK;
}

let mask = readFromUrl();
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function persist(next: number) {
  const url = new URL(window.location.href);
  url.searchParams.delete(PARAM);
  if (next !== ALL_MASK) {
    url.searchParams.set(PARAM, String(next));
  }
  window.history.replaceState(null, "", url);
}

window.addEventListener("popstate", () => {
  const next = readFromUrl();
  if (next !== mask) {
    mask = next;
    notify();
  }
});

export function useCaseSelection() {
  const selected = useSyncExternalStore(subscribe, () => mask);

  const setMask = useCallback((next: number) => {
    const clamped = next & ALL_MASK;
    if (clamped === mask) return;
    mask = clamped;
    persist(mask);
    notify();
  }, []);

  return { mask: selected, setMask };
}