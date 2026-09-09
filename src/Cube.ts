export enum Face {
  U = "U",
  D = "D",
  F = "F",
  B = "B",
  L = "L",
  R = "R",
};
type Turn = [Face, 1 | 2 | 3];
type Sticker = [Face, number];

type Cube = {
  state: Record<Face, Array<Face>>,
  mask: Array<Sticker> | null,
};

function isFace(value: string | undefined): value is Face {
  return Object.values(Face).includes(value as Face);
}

export function getCube(): Cube {
  return {
    "state": {
      "U": Array(9).fill("U"),
      "D": Array(9).fill("D"),
      "F": Array(9).fill("F"),
      "B": Array(9).fill("B"),
      "L": Array(9).fill("L"),
      "R": Array(9).fill("R"),
    },
    "mask": null,
  };
}

export function alg(cube: Cube, movesStr: string) {
  let moves = movesStr.split(" ");
  let turns = moves.flatMap(fromStr);
  for (const turn of turns) {
    turnCube(cube, turn);
  }
  return cube;
}

// TODO support rotations
// TODO support wide moves
// TODO support slice moves
function fromStr(move: string): Array<Turn> {
  if (move.length == 0) {
    throw new Error("Invalid move");
  }
  let face = move[0];
  if (!isFace(face)) {
    throw new Error("Invalid face");
  }
  if (move.length == 1) {
    return [[face, 1]];
  }
  if (move.length != 2) {
    throw new Error("Invalid turn");
  }
  switch (move[1]) {
    case "2":
      return [[face, 2]];
    case "'":
      return [[face, 3]];
    default:
      throw new Error("Invalid turn");
  }
}

function stickerCycle(cube: Cube, cycle: Array<Sticker>, inverse: boolean = false) {
  let key = cycle[0];
  if (key === undefined) {
    throw new Error("Cycle was empty");
  }
  let [oface, oindex] = key;
  let buf = cube["state"][oface][oindex]!;
  for (let i = 1; i < cycle.length; i++) {
    let [face, index] = cycle[i]!;
    let tmp = cube["state"][face][index]!;
    cube["state"][face][index] = buf;
    buf = tmp;
  }
  cube["state"][oface][oindex] = buf;
}

const faceToCycles: Record<Face, Array<Array<Sticker>>> = {
  [Face.U]: [ // B(012) -> R(012) -> F(012) -> L(012)
    [[Face.B, 0], [Face.R, 0], [Face.F, 0], [Face.L, 0]],
    [[Face.B, 1], [Face.R, 1], [Face.F, 1], [Face.L, 1]],
    [[Face.B, 2], [Face.R, 2], [Face.F, 2], [Face.L, 2]],
  ],
  [Face.D]: [ // B(678) -> L(678) -> F(678) -> R(678)
    [[Face.B, 6], [Face.L, 6], [Face.F, 6], [Face.R, 6]],
    [[Face.B, 7], [Face.L, 7], [Face.F, 7], [Face.R, 7]],
    [[Face.B, 8], [Face.L, 8], [Face.F, 8], [Face.R, 8]],
  ],
  [Face.F]: [ // U(678) -> R(036) -> D(210) -> L(852)
    [[Face.U, 6], [Face.R, 0], [Face.D, 2], [Face.L, 8]],
    [[Face.U, 7], [Face.R, 3], [Face.D, 1], [Face.L, 5]],
    [[Face.U, 8], [Face.R, 6], [Face.D, 0], [Face.L, 2]],
  ],
  [Face.B]: [ // U(012) -> L(630) -> D(876) -> R(258)
    [[Face.U, 0], [Face.L, 6], [Face.D, 8], [Face.R, 2]],
    [[Face.U, 1], [Face.L, 3], [Face.D, 7], [Face.R, 5]],
    [[Face.U, 2], [Face.L, 0], [Face.D, 6], [Face.R, 8]],
  ],
  [Face.L]: [ // U(036) -> F(036) -> D(036) -> B(852)
    [[Face.U, 0], [Face.F, 0], [Face.D, 0], [Face.B, 8]],
    [[Face.U, 3], [Face.F, 3], [Face.D, 3], [Face.B, 5]],
    [[Face.U, 6], [Face.F, 6], [Face.D, 6], [Face.B, 2]],
  ],
  [Face.R]: [ // U(258) -> B(630) -> D(258) -> F(258)
    [[Face.U, 2], [Face.B, 6], [Face.D, 2], [Face.F, 2]],
    [[Face.U, 5], [Face.B, 3], [Face.D, 5], [Face.F, 5]],
    [[Face.U, 8], [Face.B, 0], [Face.D, 8], [Face.F, 8]],
  ],
}

export function turnFace(cube: Cube, face: Face, inverse: boolean = false) {
  // step 1, rotate the face
  // 0 1 2
  // 3 4 5
  // 6 7 8
  //
  // 6 3 0
  // 7 4 1
  // 8 5 2
  // Face [0,2,8,6] [1,5,7,3]
  function helper(i: number): Sticker {
    return [face, i]
  }
  let corners = [0, 2, 8, 6].map(helper);
  let edges = [1, 5, 7, 3].map(helper);
  stickerCycle(cube, corners, inverse);
  stickerCycle(cube, edges, inverse);

  // step 2, rotate the surrounding faces
  let cycles = faceToCycles[face];
  for (const cycle of cycles) {
    stickerCycle(cube, cycle, inverse);
  }
}

function turnCube(cube: Cube, [ face, turns ]: Turn) {
  for (let i = 0; i < turns; i++) {
    turnFace(cube, face);
  }
}

function setMask(cube: Cube, mask: Array<Sticker> | null): Cube {
  cube["mask"] = mask;
  return cube;
}
