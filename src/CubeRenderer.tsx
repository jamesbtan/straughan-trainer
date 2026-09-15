import { useEffect, useReducer } from "react";
import { CANONICAL_ALGS, INVERSE_MAP, type InverseElement, type CanonicalAlg } from "./algs.ts";
import { useCaseSelection } from "./useCaseSelection.ts";
import { useSmartCube } from "./useSmartCube.ts";

import styles from './CubeRenderer.module.css';
import * as c from './Cube.ts';

const colors = {
  [c.Face.F]: styles.c_blue,
  [c.Face.B]: styles.c_green,
  [c.Face.L]: styles.c_orange,
  [c.Face.R]: styles.c_red,
  [c.Face.U]: styles.c_yellow,
  [c.Face.D]: styles.c_white,
}

type StickerProps = {
  face: c.MaskedFace,
  x: number,
  y: number,
  w: number,
  h: number,
};

function Sticker({ face, x, y, w, h }: StickerProps) {
  return <rect x={x} y={y} width={w} height={h} className={
    `${styles.facelet!} ${(face.mask) ? colors[face.face]! : styles.c_dim!}`
  } />
}

export function isSolved(cube: c.Cube): boolean {
  const top = cube.state[c.Face.U];
  for (const i of [0, 2, 6, 8]) {
    if (top[i]?.face !== c.Face.U) return false;
  }
  for (const face of [c.Face.L, c.Face.F, c.Face.R, c.Face.B]) {
    const stickers = cube.state[face];
    if (stickers[0]!.face !== stickers[2]!.face) {
      return false;
    }
  }
  return true;
}

let bag = new Set<number>();

function getScramble(pool: InverseElement[]): [InverseElement, CanonicalAlg] | undefined {
  if (pool.length === 0) {
    return undefined;
  }
  if (bag.size === 0) {
    for (let i = 0; i < pool.length; i++) {
      bag.add(i);
    }
  }
  const ids = [...bag.values()];
  const id = ids[Math.floor(Math.random() * ids.length)]!;
  bag.delete(id)
  const meta = pool[id]!;
  const alg_ref = CANONICAL_ALGS[meta.alg_id]!;
  return [meta, alg_ref];
}

function inverseToAlg([meta, alg_ref]: [InverseElement, CanonicalAlg]): c.Alg {
  const alg = new c.Alg();
  if (meta.pre_auf !== 0) {
    alg.push([c.Face.U, meta.pre_auf] as c.Move);
  }
  alg.concat(
    new c.Alg(alg_ref.alg).invert()
  );
  if (meta.post_auf !== 0) {
    alg.push([c.Face.U, meta.post_auf] as c.Move);
  }
  return alg;
}

function newScrambleCube(scramble: [InverseElement, CanonicalAlg] | undefined): c.Cube {
  const cube = new c.Cube()
    .setMask(
      c.Cube.allStickers()
      .filter(([face, index]) => {
        const m_slice = (index % 3) === 1;
        const d_layer = index >= 3;
        switch (face) {
          case c.Face.U:
            return false;
          case c.Face.D:
            return !m_slice;
          case c.Face.L:
            return d_layer;
          case c.Face.B:
            return d_layer && !m_slice;
          case c.Face.F:
            return !m_slice;
          case c.Face.R:
            return d_layer || index != 1;
        }
      })
    )
  if (scramble === undefined) {
    return cube;
  } else {
    return cube
      .apply(inverseToAlg(scramble));
  }
}

type Mode = "scramble" | "scrambled" | "solving" | "solved";

type State = {
  cube: c.Cube,
  mode: Mode,
  scramble: [InverseElement, CanonicalAlg] | undefined,
  solution: string | undefined,
  autoadvance: boolean,
};

type Action =
  | { type: "SCRAMBLE", scramble: [InverseElement, CanonicalAlg] | undefined }
  | { type: "MOVE", alg: c.Alg }
  | { type: "SPACE" }
  | { type: "ESCAPE" }
  | { type: "TOGGLE_AUTOADVANCE" };

const initialState: State = {
  cube: new c.Cube(),
  mode: "scramble",
  scramble: undefined,
  solution: undefined,
  autoadvance: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SCRAMBLE": {
      let cube = newScrambleCube(action.scramble);
      return {
        ...state,
        cube,
        mode: isSolved(cube) ? "solved" : "scrambled",
        scramble: action.scramble,
        solution: undefined,
      };
    }
    case "MOVE": {
      const cube = state.cube.clone().apply(action.alg);
      return {
        ...state,
        cube,
        mode: isSolved(cube) ? "solved" : "solving",
        scramble: state.scramble,
      };
    }
    case "SPACE": {
      if (state.mode === "solved" || typeof state.mode === "object") {
        return { ...state, mode: "scramble" };
      }
      if (state.mode === "scrambled") {
        let solution = ""
        switch (state.scramble?.[0].post_auf) {
          case 1:
            solution += "(U') ";
            break;
          case 2:
            solution += "(U2) ";
            break;
          case 3:
            solution += "(U) ";
            break;
        }
        solution += state.scramble?.[1].alg;
        return {
          ...state,
          solution,
        };
      }
      if (state.mode === "solving") {
        return {
          ...state,
          mode: "scrambled",
          cube: newScrambleCube(state.scramble!),
        };
      }
      return state;
    }
    case "TOGGLE_AUTOADVANCE": {
      return { ...state, autoadvance: !state.autoadvance };
    }
    case "ESCAPE": {
      return {
        ...state,
        cube: newScrambleCube(state.scramble!),
        mode: "scrambled",
        solution: undefined,
      };
    }
  }
}

const MOVE_KEYS: Record<string, string> = {
  w: "B",
  e: "L'",
  i: "R",
  o: "B'",
  s: "D",
  d: "L",
  f: "U'",
  g: "F'",
  h: "F",
  j: "U",
  k: "R'",
  l: "D'",
  x: "M'",
  ".": "M'",
  "5": "M",
  "6": "M",
  u: "r",
  m: "r'",
};

export function CubeRenderer() {
  const { mask } = useCaseSelection();
  const options = INVERSE_MAP
    // .map(v => v.filter(i => CANONICAL_ALGS[i.alg_id]?.two_gen));
  const pool = options.flatMap((group, i) => ((mask >> i) & 1) === 1 ? group : []);

  const [state, dispatch] = useReducer(reducer, initialState);

  const { conn, connect, disconnect } = useSmartCube((move) => {
    dispatch({ type: "MOVE", alg: new c.Alg(move) });
  });

  useEffect(() => {
    bag.clear();
    dispatch({ type: "SCRAMBLE", scramble: getScramble(pool) });
  }, [mask]);

  useEffect(() => {
    if (state.mode === "scramble") {
      dispatch({ type: "SCRAMBLE", scramble: getScramble(pool) });
    }
  }, [state.mode, pool]);

  useEffect(() => {
    if (!state.autoadvance || state.mode !== "solved") return;
    const id = setTimeout(() => dispatch({ type: "SPACE" }), 500);
    return () => clearTimeout(id);
  }, [state.autoadvance, state.mode]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        dispatch({ type: "ESCAPE" });
        return;
      }
      if (e.key === " ") {
        dispatch({ type: "SPACE" });
        return;
      }
      const move = MOVE_KEYS[e.key];
      if (move) {
        dispatch({ type: "MOVE", alg: new c.Alg(move) });
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    }
  }, []);

  return <div className={styles.wrapper}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
    <rect width="240" height="240" rx="14" className={styles.bg} />

    { // back
      Array(3).keys().map(i =>
        <Sticker face={state.cube.state[c.Face.B][i]!} x={52 + (2-i)*48} y={28} w={40} h={12} />
      )
    }

    { // left
      Array(3).keys().map(i =>
        <Sticker face={state.cube.state[c.Face.L][i]!} x={28} y={52 + i*48} w={12} h={40} />
      )
    }

    { // right
      Array(3).keys().map(i =>
        <Sticker face={state.cube.state[c.Face.R][i]!} x={200} y={52 + (2-i)*48} w={12} h={40} />
      )
    }

    { // front
      Array(3).keys().map(i =>
        <Sticker face={state.cube.state[c.Face.F][i]!} x={52 + i*48} y={200} w={40} h={12} />
      )
    }

    { // up
      Array(3).keys().flatMap(i => {
        return Array(3).keys().map(j =>
          <Sticker face={state.cube.state[c.Face.U][3*i+j]!} x={52 + j*48} y={52 + i*48} w={40} h={40} />
        )
      })
    }
    </svg>
    <div className={`${styles.status} ${state.mode === "solved" ? styles.solved : styles.unsolved}`}>
      {state.solution !== undefined ? state.solution : state.mode === "solved" ? "Solved" : "Unsolved"}
    </div>
    <button
      className={styles.connect}
      onClick={() => {
        if (conn !== null) {
          disconnect();
        } else {
          void connect();
        }
      }}
    >
      {conn !== null ? `Disconnect ${conn.deviceName}` : "Connect smart cube"}
    </button>
    <label>
      <input
        type="checkbox"
        checked={state.autoadvance}
        onChange={() => dispatch({ type: "TOGGLE_AUTOADVANCE" })}
      />
      auto-advance
    </label>
  </div>;
}
