import { useSearchParams } from "@solidjs/router";

type Filter = {
  mask: () => number;
  setMask: (mask: number) => void;
  twoGen: () => boolean;
  setTwoGen: (twoGen: boolean) => void;
};

export const cases = [
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
export const ALL_MASK = (1 << cases.length) - 1;

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
