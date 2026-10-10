import styles from "./CubeRenderer.module.css";
import { Face, MaskedFace } from "../types/Cube";
import { onSettled, Repeat } from "solid-js";
import { useCubeCtx } from "../hooks/useCube";
import { Alg } from "../types/Alg";
import { useScrambler } from "../hooks/useScrambler";

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
  const [ctx, setCubeCtx] = useCubeCtx();
  const { scramble, reset } = useScrambler();

  const handleKeydown = (e: KeyboardEvent) => {
    // TODO swap to keyCode
    switch (e.key) {
      case " ":
        if (ctx.cube.solved) {
          scramble();
        } else {
          reset();
          // TODO show solution
          console.log("unsolved");
        }
        return;
      case "Backspace":
      case "Escape":
        reset();
        return;
      case "w":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("B"));
        });
        return;
      case "e":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("L'"));
        });
        return;
      case "i":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("R"));
        });
        return;
      case "o":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("B'"));
        });
        return;
      case "s":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("D"));
        });
        return;
      case "d":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("L"));
        });
        return;
      case "f":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("U'"));
        });
        return;
      case "g":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("F'"));
        });
        return;
      case "h":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("F"));
        });
        return;
      case "j":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("U"));
        });
        return;
      case "k":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("R'"));
        });
        return;
      case "l":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("D'"));
        });
        return;
      case "x":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("M'"));
        });
        return;
      case ".":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("M'"));
        });
        return;
      case "5":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("M"));
        });
        return;
      case "6":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("M"));
        });
        return;
      case "u":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("r"));
        });
        return;
      case "m":
        setCubeCtx((d) => {
          d.cube.apply(new Alg("r'"));
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
    <>
      <button onClick={() => scramble()}>Scramble</button>
      <button onClick={() => reset()}>Reset</button>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <rect width="240" height="240" rx="14" class={styles.bg} />

        <Repeat count={3}>
          {(i) => <Sticker face={ctx.cube.state.B[i]} x={52 + (2 - i) * 48} y={28} w={40} h={12} />}
        </Repeat>

        <Repeat count={3}>
          {(i) => <Sticker face={ctx.cube.state.L[i]} x={28} y={52 + i * 48} w={12} h={40} />}
        </Repeat>

        <Repeat count={3}>
          {(i) => (
            <Sticker face={ctx.cube.state.R[i]} x={200} y={52 + (2 - i) * 48} w={12} h={40} />
          )}
        </Repeat>

        <Repeat count={3}>
          {(i) => <Sticker face={ctx.cube.state.F[i]} x={52 + i * 48} y={200} w={40} h={12} />}
        </Repeat>

        <Repeat count={3}>
          {(i) => (
            <Repeat count={3}>
              {(j) => (
                <Sticker
                  face={ctx.cube.state.U[3 * i + j]}
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
    </>
  );
}
