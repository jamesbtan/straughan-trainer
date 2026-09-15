import { useEffect, useRef, useState, useCallback } from "react";
import { CANONICAL_ALGS, INVERSE_MAP, type InverseElement } from "./algs.ts";
import { useCaseSelection } from "./useCaseSelection.ts";

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

function getScramble(pool: InverseElement[]): c.Alg {
  if (pool.length === 0) {
    throw new Error("pool was empty");
  }
  const meta = pool[Math.floor(Math.random() * pool.length)]!;
  const alg_ref = CANONICAL_ALGS[meta.alg_id]!;
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


export function CubeRenderer() {
  const { mask } = useCaseSelection();
  const options = INVERSE_MAP
    .map(v => v.filter(i => CANONICAL_ALGS[i.alg_id]?.two_gen));
  const pool = options.flatMap((group, i) => ((mask >> i) & 1) === 1 ? group : []);

  const [mode, setMode] = useState<"scramble" | "scrambled" | "solving" | "solved">("scramble");
  const currentAlg = useRef<c.Alg>(undefined);

  const [cube, setCube] = useState<c.Cube>(() => new c.Cube());

  const resetCube = () => {
    console.log("reset");
    let cube = new c.Cube()
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
      );
    if (currentAlg.current !== undefined) {
      cube.apply(currentAlg.current);
    }
    console.log(currentAlg.current);
    setCube(cube);
  };

  useEffect(() => {
    console.log("useeffect", mode);
    if (mode === "scramble") {
      currentAlg.current = getScramble(pool);
      resetCube();
      console.log("-> scrambled");
      setMode("scrambled");
    }
  }, [mode]);

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    // TODO swap to keyCode
    switch (e.key) {
      case " ":
        console.log("keydown", mode);
        if (mode === "solved") {
          setMode("scramble");
        } else if (mode === "solving") {
          // TODO reset cube
        } else if (mode === "scrambled") {
          console.log("3");
          // TODO show solution and allow next
        }
        return;
      case "w":
        setCube(cube => cube.clone().apply(new c.Alg("B")));
        break;
      case "e":
        setCube(cube => cube.clone().apply(new c.Alg("L'")));
        break;
      case "i":
        setCube(cube => cube.clone().apply(new c.Alg("R")));
        break;
      case "o":
        setCube(cube => cube.clone().apply(new c.Alg("B'")));
        break;
      case "s":
        setCube(cube => cube.clone().apply(new c.Alg("D")));
        break;
      case "d":
        setCube(cube => cube.clone().apply(new c.Alg("L")));
        break;
      case "f":
        setCube(cube => cube.clone().apply(new c.Alg("U'")));
        break;
      case "g":
        setCube(cube => cube.clone().apply(new c.Alg("F'")));
        break;
      case "h":
        setCube(cube => cube.clone().apply(new c.Alg("F")));
        break;
      case "j":
        setCube(cube => cube.clone().apply(new c.Alg("U")));
        break;
      case "k":
        setCube(cube => cube.clone().apply(new c.Alg("R'")));
        break;
      case "l":
        setCube(cube => cube.clone().apply(new c.Alg("D'")));
        break;
      case "x":
        setCube(cube => cube.clone().apply(new c.Alg("M'")));
        break;
      case ".":
        setCube(cube => cube.clone().apply(new c.Alg("M'")));
        break;
      case "5":
        setCube(cube => cube.clone().apply(new c.Alg("M")));
        break;
      case "6":
        setCube(cube => cube.clone().apply(new c.Alg("M")));
        break;
      case "u":
        setCube(cube => cube.clone().apply(new c.Alg("r")));
        break;
      case "m":
        setCube(cube => cube.clone().apply(new c.Alg("r'")));
        break;
      default:
        return;
    }
    if (isSolved(cube)) {
      setMode("solved");
    } else {
      setMode("solving");
    }
  }, [mode]);

  useEffect(() => {
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
        <Sticker face={cube.state["B"][i]!} x={52 + (2-i)*48} y={28} w={40} h={12} />
      )
    }

    { // left
      Array(3).keys().map(i =>
        <Sticker face={cube.state["L"][i]!} x={28} y={52 + i*48} w={12} h={40} />
      )
    }

    { // right
      Array(3).keys().map(i =>
        <Sticker face={cube.state["R"][i]!} x={200} y={52 + (2-i)*48} w={12} h={40} />
      )
    }

    { // front
      Array(3).keys().map(i =>
        <Sticker face={cube.state["F"][i]!} x={52 + i*48} y={200} w={40} h={12} />
      )
    }

    { // up
      Array(3).keys().flatMap(i => {
        return Array(3).keys().map(j =>
          <Sticker face={cube.state["U"][3*i+j]!} x={52 + j*48} y={52 + i*48} w={40} h={40} />
        )
      })
    }
    </svg>
    <div className={`${styles.status} ${mode === "solved" ? styles.solved : styles.unsolved}`}>
      {mode === "solved" ? "Solved" : "Unsolved"}
    </div>
  </div>;
}
