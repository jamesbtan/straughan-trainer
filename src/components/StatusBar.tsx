import { Show } from "solid-js";
import { useCubeCtx } from "../hooks/useCube";

export function StatusBar() {
  const [ctx] = useCubeCtx();

  return (
    <Show when={ctx.cube.solved} fallback={<>Unsolved</>}>
      Solved
    </Show>
  );
}
