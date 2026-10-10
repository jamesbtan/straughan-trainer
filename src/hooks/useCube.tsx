import { Cube } from "../types/Cube";
import { createStore, useContext } from "solid-js";
import { createContext } from "solid-js";
import { Alg } from "../types/Alg";

export type CubeStore = {
  cube: Cube;
  scramble?: Alg;
  scrambler?: () => Alg | undefined;
  reset?: (self: CubeStore) => void;
};

export function createCubeCtx(initial: CubeStore) {
  return createStore<CubeStore>(initial);
}

export const CubeContext = createContext<ReturnType<typeof createCubeCtx>>();

export function useCubeCtx() {
  return useContext(CubeContext);
}
