import { Show } from "solid-js";
import { useCubeCtx } from "../hooks/useCube";
import { useScrambler } from "../hooks/useScrambler";

export function CubeControls() {
  const [ctx] = useCubeCtx();
  const { scramble, reset } = useScrambler();
  return (
    <>
      <div>
        <Show when={ctx.cube.solved} fallback={<>Unsolved</>}>
          Solved
        </Show>
      </div>
      <button onClick={() => scramble()}>Scramble</button>
      <button onClick={() => reset()}>Reset</button>
      <Show when={ctx.showSolution}>{ctx.solution}</Show>
    </>
  );
}
