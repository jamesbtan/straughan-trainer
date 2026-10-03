import { useSearchParams } from "@solidjs/router";
import { createEffect, For, Show } from "solid-js";

const cases = [
  "headlights",
  "towers",
  "sune",
  "anti-sune",
  "bottom",
  "top",
  "opposite",
  "anti-pi",
  "pi",
  "true diag",
  "diag up",
  "diag right",
  "L",
  "S",
  "Z",
];
const ALL_MASK = (1 << cases.length) - 1;

function enabled(mask: number, i: number): boolean {
  return !!((mask >> i) & 1);
}

function toggle(mask: number, i: number): number {
  return mask ^ (1 << i);
}

export function useMask(): [() => number, (mask: number) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const mask = () => Number(searchParams.algs);
  const setMask = (mask: number) => {
    setSearchParams({ algs: mask }, { replace: true });
  };
  return [mask, setMask];
}

export function AlgSelector() {
  const [mask, setMask] = useMask();

  createEffect(
    () => mask(),
    (mask) => {
      if (Number.isNaN(mask) || mask < 0 || mask > ALL_MASK) {
        setMask(ALL_MASK);
      }
    },
  );

  return (
    <details>
      <summary>Select algorithms</summary>
      <Show when={mask() === 0} fallback={<button onClick={() => setMask(0)}>Deselect all</button>}>
        <button onClick={() => setMask(ALL_MASK)}>Select all</button>
      </Show>
      <For each={cases}>
        {(title, i) => (
          <div>
            <input
              checked={enabled(mask(), i())}
              onChange={() => setMask(toggle(mask(), i()))}
              name={`${i()}`}
              id={`${i()}`}
              type="checkbox"
            />
            <label for={`${i()}`}>{title}</label>
          </div>
        )}
      </For>
    </details>
  );
}
