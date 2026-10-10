import { createEffect, createSignal } from "solid-js";
import { useCube } from "../hooks/useCube";
import { Cube, Face } from "../types/Cube";
import { CANONICAL_ALGS, INVERSE_MAP, InverseElement } from "../data/algs";
import { enabled, useFilters } from "./AlgSelector";
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

const F2B_W_STRAUGHAN = Cube.allStickers().filter(([face, index]) => {
  const m_slice = index % 3 === 1;
  const d_layer = index >= 3;
  switch (face) {
    case Face.U:
      return false;
    case Face.D:
      return !m_slice;
    case Face.L:
      return d_layer;
    case Face.B:
      return d_layer && !m_slice;
    case Face.F:
      return !m_slice;
    case Face.R:
      return d_layer || index != 1;
  }
});

export function CubeScrambler() {
  const [, setCube] = useCube();
  const [alg, setAlg] = createSignal<Alg>();

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

  const scramble = (scrambler: () => Alg | undefined) => {
    let alg: Alg | undefined = undefined;
    setAlg(() => {
      alg = scrambler?.();
      return alg;
    });
    setCube((d) => {
      let cube = d.setSolved();
      if (alg === undefined) {
        return cube;
      }
      cube.setMask(F2B_W_STRAUGHAN).apply(alg);
    });
  };

  // TODO refactor create effect
  createEffect(
    () => scrambler(),
    (scrambler) => scramble(scrambler),
  );

  const reset = () => {
    const scramble = alg();
    setCube((d) => {
      d.setSolved().setMask(F2B_W_STRAUGHAN);
      if (scramble !== undefined) {
        d.apply(scramble);
      }
    });
  };

  return (
    <>
      <button onClick={() => scramble(scrambler())}>Scramble</button>
      <button onClick={() => reset()}>Reset</button>
    </>
  );
}
