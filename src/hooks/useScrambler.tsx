import { createEffect } from "solid-js";
import { useCubeCtx } from "./useCube";
import { Face } from "../types/Cube";
import { CANONICAL_ALGS, INVERSE_MAP, InverseElement } from "../data/algs";
import { enabled, useFilters } from "../components/AlgSelector";
import { Alg } from "../types/Alg";

function getScramble(options: InverseElement[][]): Alg {
  const probs: number[] = Array.from({ length: options.length + 1 });
  probs[0] = 0;
  for (let i = 1; i <= options.length; i++) {
    probs[i] = probs[i - 1]! + options[i - 1]!.length;
  }

  // technically we can bsearch
  // but lazy
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

  const metadata = options[alg_group!][group_id!];
  return Alg.fromMoves([[Face.U, metadata.pre_auf]])
    .andThen(new Alg(CANONICAL_ALGS[metadata.alg_id].alg).invert().moves)
    .andThen([[Face.U, metadata.post_auf]]);
}

export function useScrambler() {
  const [, setCtx] = useCubeCtx();

  const filters = useFilters();

  const scrambler = () => {
    const mask = filters.mask();
    const twoGen = filters.twoGen();
    return () => {
      if (mask === 0) return undefined;

      const options = INVERSE_MAP.map((v, index) =>
        !enabled(mask, index)
          ? []
          : twoGen
            ? v.filter((i) => CANONICAL_ALGS[i.alg_id]!.two_gen)
            : v,
      );

      return getScramble(options);
    };
  };

  // TODO refactor createEffect
  // maybe derived stores I think are related idk
  createEffect(
    () => scrambler(),
    (scrambler) => {
      setCtx((d) => {
        d.scrambler = scrambler;
        d.scramble = scrambler?.();
        d.reset?.(d);
      });
    },
  );

  return {
    scramble: () =>
      setCtx((d) => {
        d.scramble = d.scrambler?.();
        d.reset?.(d);
      }),
    reset: () => setCtx((d) => d.reset?.(d)),
  };
}
