import { useSearchParams } from "@solidjs/router";
import { For, Show } from "solid-js";

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

function toggle(mask: number, i: number): number {
  return mask ^ (1 << i);
}

export function enabled(mask: number, i: number): boolean {
  return ((mask >> i) & 1) === 1;
}

type Filter = {
  mask: () => number;
  setMask: (mask: number) => void;
  twoGen: () => boolean;
  setTwoGen: (twoGen: boolean) => void;
};

export function useFilters(): Filter {
  const [searchParams, setSearchParams] = useSearchParams();
  const setMask = (mask: number) => {
    setSearchParams({ algs: mask }, { replace: true });
  };
  const mask = () => {
    let mask = Number(searchParams.algs);
    if (Number.isNaN(mask) || mask < 0 || mask > ALL_MASK) {
      setMask(ALL_MASK);
      return ALL_MASK;
    }
    return mask;
  };
  const setTwoGen = (twoGen: boolean) => {
    setSearchParams({ two_gen: twoGen }, { replace: true });
  };
  const twoGen = () => {
    return searchParams.two_gen === "true";
  };
  return { mask, setMask, twoGen, setTwoGen };
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
