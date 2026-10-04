import { createEffect } from "solid-js";
import { useCube } from "../hooks/useCube";
import { Cube, Face } from "./Cube";
import { CANONICAL_ALGS, INVERSE_MAP, InverseElement } from "../data/algs";
import { enabled, useFilters } from "./AlgSelector";

function scramble(cube: Cube, options: InverseElement[][]) {
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
  const alg = CANONICAL_ALGS[metadata.alg_id].alg;

  cube
    .setSolved()
    .setMask(
      Cube.allStickers().filter(([face, index]) => {
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
      }),
    )
    .turnFace(Face.U, metadata.pre_auf)
    .alg(alg, true)
    .turnFace(Face.U, metadata.post_auf);
  // .alg("z")
  // .maskAll();
}

export function CubeScrambler() {
  const [, setCube] = useCube();

  const filters = useFilters();

  const scrambler = () => {
    const mask = filters.mask();
    const twoGen = filters.twoGen();
    return (cube: Cube) => {
      cube.setSolved();
      if (mask === 0) return;

      const options = INVERSE_MAP.map((v, index) =>
        !enabled(mask, index)
          ? []
          : twoGen
            ? v.filter((i) => CANONICAL_ALGS[i.alg_id]!.two_gen)
            : v,
      );

      scramble(cube, options);
    };
  };

  // TODO refactor create effect
  // I think eventually what will happen
  // Scrambler in one context+store (or I guess can just be a signal)
  // Cube in another NESTED context+store
  // This allows to reset the cube in a way that let's us preserve current
  // signal OR advance to a new scramble
  // so it goes like cube is derived from scrambler
  // scrambler is derived for params
  // so when params update the scrambler updates, which creates a new cube
  // or we can have the scrambler stay the same and a new cube is made
  // since they are separate layers
  createEffect(
    () => scrambler(),
    (scrambler) => {
      setCube((d) => scrambler(d));
    },
  );

  return (
    <button
      onClick={() => {
        setCube((d) => scrambler()(d));
      }}
    >
      Scramble
    </button>
  );
}
