import { For, Show } from "solid-js";
import { ALL_MASK, cases, useFilters } from "../hooks/useFilters";

function toggle(mask: number, i: number): number {
  return mask ^ (1 << i);
}

export function enabled(mask: number, i: number): boolean {
  return ((mask >> i) & 1) === 1;
}

export function AlgSelector() {
  const { mask, setMask, twoGen, setTwoGen } = useFilters();

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
              name={`algfilter-${i()}`}
              id={`algfilter-${i()}`}
              type="checkbox"
            />
            <label for={`algfilter-${i()}`}>{title}</label>
          </div>
        )}
      </For>
      <hr />
      <input
        checked={twoGen()}
        onChange={() => setTwoGen(!twoGen())}
        type="checkbox"
        name="two-gen"
        id="two-gen"
      />
      <label for="two-gen">2-gen only</label>
    </details>
  );
}
