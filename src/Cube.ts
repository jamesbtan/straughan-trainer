enum Face {
  U = "U",
  D = "D",
  F = "F",
  B = "B",
  L = "L",
  R = "R",
};
type Cube = Record<Face, Array<Face>>;

function isFace(value: string): value is Face {
  return Object.values(Face).includes(value);
}

export function getCube(): Cube {
  return {
    "U": Array(9).fill("U"),
    "D": Array(9).fill("D"),
    "F": Array(9).fill("F"),
    "B": Array(9).fill("B"),
    "L": Array(9).fill("L"),
    "R": Array(9).fill("R"),
  };
}

type Turn = [Face, 1 | 2 | 3];
type Sticker = [Face, number];

export function alg(cube: Cube, movesStr: string) {
  let moves = movesStr.split(" ");
  for (const move of moves) {
    const turn = fromStr(move);
    turnCube(cube, turn);
  }
}

// TODO support rotations
// TODO support wide moves
// TODO support slice moves
function fromStr(move: string): Turn {
  let face = move[0];
  if (!isFace(face)) {
    throw new Error("Invalid face");
  }
  if (move.length == 1) {
    return [face, 1];
  }
  if (move.length != 2) {
    throw new Error("Invalid turn");
  }
  switch (move[1]) {
    case "2":
      return [face, 2];
    case "'":
      return [face, 3];
    default:
      throw new Error("Invalid turn");
  }
}

function stickerCycle(cube: Cube, cycle: Array<Sticker>) {
  let [oface, oindex] = cycle[0];
  let buf = cube[oface][oindex];
  for (let i = 1; i < cycle.length; i++) {
    let [face, index] = cycle[i];
    let tmp = cube[face][index];
    cube[face][index] = buf;
    buf = tmp;
  }
  cube[oface][oindex] = buf;
}

const faceToCycles: Record<Face, Array<Array<Sticker>>> = {
  "U": [ // B(012) -> R(012) -> F(012) -> L(012)
    [['B', 0], ['R', 0], ['F', 0], ['L', 0]],
    [['B', 1], ['R', 1], ['F', 1], ['L', 1]],
    [['B', 2], ['R', 2], ['F', 2], ['L', 2]],
  ],
  "D": [ // B(678) -> L(678) -> F(678) -> R(678)
    [['B', 6], ['L', 6], ['F', 6], ['R', 6]],
    [['B', 7], ['L', 7], ['F', 7], ['R', 7]],
    [['B', 8], ['L', 8], ['F', 8], ['R', 8]],
  ],
  "F": [ // U(678) -> R(036) -> D(210) -> L(852)
    [['U', 6], ['R', 0], ['D', 2], ['L', 8]],
    [['U', 7], ['R', 3], ['D', 1], ['L', 5]],
    [['U', 8], ['R', 6], ['D', 0], ['L', 2]],
  ],
  "B": [ // U(012) -> L(630) -> D(876) -> R(258)
    [['U', 0], ['L', 6], ['D', 8], ['R', 2]],
    [['U', 1], ['L', 3], ['D', 7], ['R', 5]],
    [['U', 2], ['L', 0], ['D', 6], ['R', 8]],
  ],
  "L": [ // U(036) -> F(036) -> D(036) -> B(852)
    [['U', 0], ['F', 0], ['D', 0], ['B', 8]],
    [['U', 3], ['F', 3], ['D', 3], ['B', 5]],
    [['U', 6], ['F', 6], ['D', 6], ['B', 2]],
  ],
  "R": [ // U(258) -> B(630) -> D(258) -> F(258)
    [['U', 2], ['B', 6], ['D', 2], ['F', 2]],
    [['U', 5], ['B', 3], ['D', 5], ['F', 5]],
    [['U', 8], ['B', 0], ['D', 8], ['F', 8]],
  ],
}

export function turnFace(cube: Cube, face: Face) {
  // step 1, rotate the face
  // 0 1 2
  // 3 4 5
  // 6 7 8
  //
  // 6 3 0
  // 7 4 1
  // 8 5 2
  // Face [0,2,8,6] [1,5,7,3]
  let corners = [0, 2, 8, 6].map(i => [face, i]);
  let edges = [1, 5, 7, 3].map(i => [face, i]);
  stickerCycle(cube, corners);
  stickerCycle(cube, edges);

  // step 2, rotate the surrounding faces
  let cycles = faceToCycles[face];
  for (const cycle of cycles) {
    stickerCycle(cube, cycle);
  }
}

function turnCube(cube: Cube, [ face, turns ]: Turn) {
  for (let i = 0; i < turns; i++) {
    turnFace(cube, face);
  }
}
