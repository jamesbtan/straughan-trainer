import { Cube } from "../types/Cube";
import { createStore, ParentProps, useContext } from "solid-js";
import { createContext } from "solid-js";

function createCube() {
  return createStore(new Cube());
}

const CubeContext = createContext<ReturnType<typeof createCube>>();

export function CubeProvider(props: ParentProps) {
  return <CubeContext value={createCube()}>{props.children}</CubeContext>;
}

export function useCube() {
  return useContext(CubeContext);
}
