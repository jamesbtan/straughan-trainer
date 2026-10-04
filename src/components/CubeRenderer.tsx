import styles from "./CubeRenderer.module.css";
import { Face, MaskedFace } from "./Cube";
import { onSettled, Repeat } from "solid-js";
import { useCube } from "../hooks/useCube";

const colors = {
  [Face.F]: styles.c_blue,
  [Face.B]: styles.c_green,
  [Face.L]: styles.c_orange,
  [Face.R]: styles.c_red,
  [Face.U]: styles.c_yellow,
  [Face.D]: styles.c_white,
};

type StickerProps = {
  face: MaskedFace;
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
  const [cube, setCube] = useCube();

  const handleKeydown = (e: KeyboardEvent) => {
    // console.log(e);
    // TODO swap to keyCode
    switch (e.key) {
      case "w":
        setCube((d) => {
          d.alg("B");
        });
        return;
      case "e":
        setCube((d) => {
          d.alg("L'");
        });
        return;
      case "i":
        setCube((d) => {
          d.alg("R");
        });
        return;
      case "o":
        setCube((d) => {
          d.alg("B'");
        });
        return;
      case "s":
        setCube((d) => {
          d.alg("D");
        });
        return;
      case "d":
        setCube((d) => {
          d.alg("L");
        });
        return;
      case "f":
        setCube((d) => {
          d.alg("U'");
        });
        return;
      case "g":
        setCube((d) => {
          d.alg("F'");
        });
        return;
      case "h":
        setCube((d) => {
          d.alg("F");
        });
        return;
      case "j":
        setCube((d) => {
          d.alg("U");
        });
        return;
      case "k":
        setCube((d) => {
          d.alg("R'");
        });
        return;
      case "l":
        setCube((d) => {
          d.alg("D'");
        });
        return;
      case "x":
        setCube((d) => {
          d.alg("M'");
        });
        return;
      case ".":
        setCube((d) => {
          d.alg("M'");
        });
        return;
      case "5":
        setCube((d) => {
          d.alg("M");
        });
        return;
      case "6":
        setCube((d) => {
          d.alg("M");
        });
        return;
      case "u":
        setCube((d) => {
          d.alg("r");
        });
        return;
      case "m":
        setCube((d) => {
          d.alg("r'");
        });
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
