import { useEffect, useState } from "react";

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


export function CubeRenderer() {
  const [cube, setCube] = useState(
    new c.Cube()
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
    // .alg("z")
    // .maskAll()
  );

  function handleKeydown(e: KeyboardEvent) {
    // console.log(e);
    // TODO swap to keyCode
    switch (e.key) {
      case "w":
        setCube(cube.clone().alg("B"));
        return;
      case "e":
        setCube(cube.clone().alg("L'"));
        return;
      case "i":
        setCube(cube.clone().alg("R"));
        return;
      case "o":
        setCube(cube.clone().alg("B'"));
        return;
      case "s":
        setCube(cube.clone().alg("D"));
        return;
      case "d":
        setCube(cube.clone().alg("L"));
        return;
      case "f":
        setCube(cube.clone().alg("U'"));
        return;
      case "g":
        setCube(cube.clone().alg("F'"));
        return;
      case "h":
        setCube(cube.clone().alg("F"));
        return;
      case "j":
        setCube(cube.clone().alg("U"));
        return;
      case "k":
        setCube(cube.clone().alg("R'"));
        return;
      case "l":
        setCube(cube.clone().alg("D'"));
        return;
      case "x":
        setCube(cube.clone().alg("M'"));
        return;
      case ".":
        setCube(cube.clone().alg("M'"));
        return;
      case "5":
        setCube(cube.clone().alg("M"));
        return;
      case "6":
        setCube(cube.clone().alg("M"));
        return;
      case "u":
        setCube(cube.clone().alg("r"));
        return;
      case "m":
        setCube(cube.clone().alg("r'"));
        return;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    }
  }, []);

  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
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
  </svg>;
}
