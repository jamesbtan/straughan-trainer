import { Cube } from "../types/Cube";
import { createStore, useContext } from "solid-js";
import { createContext } from "solid-js";
import { Alg } from "../types/Alg";

// TODO ideally scramble/solution would be read-only fields
// idk of typescript has something for that
export type CubeStore = {
  cube: Cube;
  scrambler?: () => Alg | undefined;
  reset?: (self: CubeStore) => void;
} & (
  | { scramble?: undefined; solution?: undefined }
  | {
      scramble: Alg;
      solution: string;
    }
);

export function createCubeCtx(initial: CubeStore) {
  return createStore<CubeStore>(initial);
}

export const CubeContext = createContext<ReturnType<typeof createCubeCtx>>();

export function useCubeCtx() {
  return useContext(CubeContext);
}

export function setScramble(ctx: CubeStore, scramble: Alg | undefined) {
  ctx.scramble = scramble;
  if (scramble === undefined) {
    ctx.solution = undefined;
  } else {
    ctx.solution = Alg.from(scramble.moves).invert().toString();
  }
}
