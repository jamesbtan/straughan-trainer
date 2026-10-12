import { Cube } from "../types/Cube";
import { createStore, useContext } from "solid-js";
import { createContext } from "solid-js";
import { Alg } from "../types/Alg";

// don't know if there's a better way to do this in TS
// CubeStoreOpts enforces the input type schema
// and CubeStore does normalization + enforces read-only semantics
type CubeStoreOpts = {
  cube: Cube;
  scrambler?: () => Alg | undefined;
  reset?: (self: CubeStore) => void;
  showSolution?: boolean;
  scramble?: Alg;
};

export class CubeStore {
  cube: Cube;
  scrambler?: () => Alg | undefined;
  reset?: (self: CubeStore) => void;
  showSolution: boolean;
  private _scramble!: Alg;
  private _solution!: string;

  constructor(options: CubeStoreOpts) {
    this.cube = options.cube;
    this.scrambler = options.scrambler;
    this.reset = options.reset;
    this.showSolution = options.showSolution ?? false;
    this.setScramble(options.scramble);
  }

  get scramble(): Alg {
    return this._scramble;
  }

  get solution(): string {
    return this._solution;
  }

  setScramble(scramble: Alg | undefined) {
    this._scramble = scramble ?? new Alg();
    this._solution = Alg.from(this._scramble.moves).invert().toString();
  }
}

export function createCubeCtx(initial: CubeStore) {
  return createStore<CubeStore>(initial);
}

export const CubeContext = createContext<ReturnType<typeof createCubeCtx>>();

export function useCubeCtx() {
  return useContext(CubeContext);
}
