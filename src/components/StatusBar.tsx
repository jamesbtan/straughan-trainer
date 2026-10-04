import { Show } from "solid-js";
import { useCube } from "../hooks/useCube";

export function StatusBar() {
  const [cube] = useCube();

  return (
    <Show when={cube.solved} fallback={<>Unsolved</>}>
      Solved
    </Show>
  );
}
