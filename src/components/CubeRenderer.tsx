import { CANONICAL_ALGS, INVERSE_MAP } from "../data/algs";

import styles from "./CubeRenderer.module.css";
import * as c from "./Cube";
import { createStore, onSettled, Repeat } from "solid-js";

const colors = {
  [c.Face.F]: styles.c_blue,
  [c.Face.B]: styles.c_green,
  [c.Face.L]: styles.c_orange,
  [c.Face.R]: styles.c_red,
  [c.Face.U]: styles.c_yellow,
  [c.Face.D]: styles.c_white,
};

type StickerProps = {
  face: c.MaskedFace;
  x: number;
  y: number;
  w: number;
  h: number;
};

function Sticker(props: StickerProps) {
  return (
    <rect
      x={props.x}
      y={props.y}
      width={props.w}
      height={props.h}
      class={[
        styles.facelet,
        {
          [colors[props.face.face]!]: props.face.mask,
          [styles.c_dim!]: !props.face.mask,
        },
      ]}
    />
  );
}

export function CubeRenderer() {
  const options = INVERSE_MAP.map((v) => v.filter((i) => CANONICAL_ALGS[i.alg_id]!.two_gen));
  const probs: number[] = Array.from({ length: options.length + 1 });
  probs[0] = 0;
  for (let i = 1; i <= options.length; i++) {
    probs[i] = probs[i - 1]! + options[i - 1]!.length;
  }

  const rng = Math.floor(Math.random() * probs[probs.length - 1]!);
  let alg_group;
  let group_id;
  for (let i = 1; i <= probs.length; i++) {
    if (rng < probs[i]!) {
      alg_group = i - 1;
      group_id = rng - probs[i - 1]!;
      break;
    }
  }

  const metadata = options[alg_group!]![group_id!]!;
  const alg = CANONICAL_ALGS[metadata.alg_id]!.alg;
  const [cube, setCube] = createStore(
    new c.Cube()
      .setMask(
        c.Cube.allStickers().filter(([face, index]) => {
          const m_slice = index % 3 === 1;
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
        }),
      )
      .turnFace(c.Face.U, metadata.pre_auf)
      .alg(alg, true)
      .turnFace(c.Face.U, metadata.post_auf),
    // .alg("z")
    // .maskAll()
  );

  const handleKeydown = (e: KeyboardEvent) => {
    // console.log(e);
    // TODO swap to keyCode
    switch (e.key) {
      case "w":
        setCube((cube) => cube.alg("B"));
        return;
      case "e":
        setCube((cube) => cube.alg("L'"));
        return;
      case "i":
        setCube((cube) => cube.alg("R"));
        return;
      case "o":
        setCube((cube) => cube.alg("B'"));
        return;
      case "s":
        setCube((cube) => cube.alg("D"));
        return;
      case "d":
        setCube((cube) => cube.alg("L"));
        return;
      case "f":
        setCube((cube) => cube.alg("U'"));
        return;
      case "g":
        setCube((cube) => cube.alg("F'"));
        return;
      case "h":
        setCube((cube) => cube.alg("F"));
        return;
      case "j":
        setCube((cube) => cube.alg("U"));
        return;
      case "k":
        setCube((cube) => cube.alg("R'"));
        return;
      case "l":
        setCube((cube) => cube.alg("D'"));
        return;
      case "x":
        setCube((cube) => cube.alg("M'"));
        return;
      case ".":
        setCube((cube) => cube.alg("M'"));
        return;
      case "5":
        setCube((cube) => cube.alg("M"));
        return;
      case "6":
        setCube((cube) => cube.alg("M"));
        return;
      case "u":
        setCube((cube) => cube.alg("r"));
        return;
      case "m":
        setCube((cube) => cube.alg("r'"));
        return;
    }
  };

  onSettled(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <rect width="240" height="240" rx="14" class={styles.bg} />

      <Repeat count={3}>
        {(i) => <Sticker face={cube.state.B[i]} x={52 + (2 - i) * 48} y={28} w={40} h={12} />}
      </Repeat>

      <Repeat count={3}>
        {(i) => <Sticker face={cube.state.L[i]} x={28} y={52 + i * 48} w={12} h={40} />}
      </Repeat>

      <Repeat count={3}>
        {(i) => <Sticker face={cube.state.R[i]} x={200} y={52 + (2 - i) * 48} w={12} h={40} />}
      </Repeat>

      <Repeat count={3}>
        {(i) => <Sticker face={cube.state.F[i]} x={52 + i * 48} y={200} w={40} h={12} />}
      </Repeat>

      <Repeat count={3}>
        {(i) => (
          <Repeat count={3}>
            {(j) => (
              <Sticker
                face={cube.state.U[3 * i + j]}
                x={52 + j * 48}
                y={52 + i * 48}
                w={40}
                h={40}
              />
            )}
          </Repeat>
        )}
      </Repeat>
    </svg>
  );
}
