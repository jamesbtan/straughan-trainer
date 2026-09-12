export enum Face {
  F = "F",
  B = "B",
  L = "L",
  R = "R",
  U = "U",
  D = "D",
};
export enum Rotation {
  x = "x",
  y = "y",
  z = "z",
};
export enum Slice {
  M = "M",
  E = "E",
  S = "S",
};

type Move = [Face | Rotation, 1 | 2 | 3];
type Sticker = [Face, number];

export type MaskedFace = {
  face: Face,
  mask: boolean,
};

function isFace(value: string | undefined): value is Face {
  return Object.values(Face).includes(value as Face);
}
function isSlice(value: string | undefined): value is Slice {
  return Object.values(Slice).includes(value as Slice);
}
function isRotation(value: string | undefined): value is Rotation {
  return Object.values(Rotation).includes(value as Rotation);
}

const faceToCycles: Record<Face, Sticker[][]> = {
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
}

const rotationToCycle: Record<Rotation, Face[]> = {
  [Rotation.x]: [Face.U, Face.B, Face.D, Face.F],
  [Rotation.y]: [Face.F, Face.L, Face.B, Face.R],
  [Rotation.z]: [Face.U, Face.R, Face.D, Face.L],
};

// there should be some symmetry here to not need to list all
// or maybe if we have a better indexing scheme idk
const faceToFace: Record<Face, Partial<Record<Face, number[]>>> = {
  [Face.F]: {
    [Face.L]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.R]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.U]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.D]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  [Face.B]: {
    [Face.L]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.R]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.U]: [8, 7, 6, 5, 4, 3, 2, 1, 0],
    [Face.D]: [8, 7, 6, 5, 4, 3, 2, 1, 0],
  },
  [Face.L]: {
    [Face.F]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.B]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.U]: [2, 5, 8, 1, 4, 7, 0, 3, 6],
    [Face.D]: [6, 3, 0, 7, 4, 1, 8, 5, 2],
  },
  [Face.R]: {
    [Face.F]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.B]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.U]: [6, 3, 0, 7, 4, 1, 8, 5, 2],
    [Face.D]: [2, 5, 8, 1, 4, 7, 0, 3, 6],
  },
  [Face.U]: {
    [Face.F]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.B]: [8, 7, 6, 5, 4, 3, 2, 1, 0],
    [Face.L]: [6, 3, 0, 7, 4, 1, 8, 5, 2],
    [Face.R]: [2, 5, 8, 1, 4, 7, 0, 3, 6],
  },
  [Face.D]: {
    [Face.F]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [Face.B]: [8, 7, 6, 5, 4, 3, 2, 1, 0],
    [Face.L]: [2, 5, 8, 1, 4, 7, 0, 3, 6],
    [Face.R]: [6, 3, 0, 7, 4, 1, 8, 5, 2],
  },
}

const rotationToWings: Record<Rotation, Face[]> = {
  [Rotation.x]: [Face.R, Face.L],
  [Rotation.y]: [Face.U, Face.D],
  [Rotation.z]: [Face.F, Face.B],
}

const wide: Record<Face, Move[]> = {
  [Face.F]: [[Face.B, 1], [Rotation.z, 1]],
  [Face.B]: [[Face.F, 1], [Rotation.z, 3]],
  [Face.L]: [[Face.R, 1], [Rotation.x, 3]],
  [Face.R]: [[Face.L, 1], [Rotation.x, 1]],
  [Face.U]: [[Face.D, 1], [Rotation.y, 1]],
  [Face.D]: [[Face.U, 1], [Rotation.y, 3]],
}

const slice: Record<Slice, Move[]> = {
  [Slice.S]: [[Face.F, 3], [Face.B, 1], [Rotation.z, 1]],
  [Slice.E]: [[Face.U, 3], [Face.D, 1], [Rotation.y, 1]],
  [Slice.M]: [[Face.R, 1], [Face.L, 3], [Rotation.x, 3]],
}

function mult(r: Move, x: number): Move {
  const clone: Move = [...r];
  clone[1] *= x;
  clone[1] %= 4;
  return clone;
};

function stringToMoves(move: string): Move[] {
  if (move.length == 0) {
    throw new Error("Invalid move");
  }
  const initial = move[0]!;
  let result;
  if (isRotation(initial) || isFace(initial)) {
    result = [[initial, 1] as Move];
  } else if (isSlice(initial)) {
    result = slice[initial];
  } else {
    const upper = initial.toUpperCase();
    if (!isFace(upper)) {
      throw new Error("Invalid move");
    }
    result = wide[upper];
  }
  if (move.length == 1) {
    return result;
  }
  switch (move.substring(1)) {
    case "2":
    case "2'":
      return result.map(r => mult(r, 2));
    case "'":
      return result.map(r => mult(r, 3));
    default:
      throw new Error("Invalid turn");
  }
}
export class Cube {
  state: Record<Face, MaskedFace[]>;

  constructor() {
    this.state = {
      [Face.F]: [...Array(9).keys().map(() => ({"face": Face.F, "mask": false}))],
      [Face.B]: [...Array(9).keys().map(() => ({"face": Face.B, "mask": false}))],
      [Face.L]: [...Array(9).keys().map(() => ({"face": Face.L, "mask": false}))],
      [Face.R]: [...Array(9).keys().map(() => ({"face": Face.R, "mask": false}))],
      [Face.U]: [...Array(9).keys().map(() => ({"face": Face.U, "mask": false}))],
      [Face.D]: [...Array(9).keys().map(() => ({"face": Face.D, "mask": false}))],
    };
  }

  clone(): Cube {
    const c = Object.create(Object.getPrototypeOf(this) as object) as Cube;
    c.state = this.state;
    return c;
  }

  alg(movesStr: string, inverse: boolean = false): this {
    const moves = movesStr.split(" ");
    let simpl = moves.flatMap(stringToMoves);
    if (inverse) {
      simpl.reverse();
      simpl = simpl.map(m => mult(m, 3));
    }
    for (const [initial, turns] of simpl) {
      if (isRotation(initial)) {
        this._rotateCube(initial, turns);
      } else {
        this.turnFace(initial, turns);
      }
    }
    return this;
  }


  private stickerCycle(cycle: Sticker[], inverse: boolean) {
    const key = cycle[0];
    if (key === undefined) {
      throw new Error("Cycle was empty");
    }
    const [oface, oindex] = key;
    let buf = this.state[oface][oindex]!;
    const swap = (i: number) => {
      const [face, index] = cycle[i]!;
      const tmp = this.state[face][index]!;
      this.state[face][index] = buf;
      buf = tmp;
    }
    if (inverse) {
      for (let i = 1; i < cycle.length; i++) {
        swap(cycle.length - i);
      }
    } else {
      for (let i = 1; i < cycle.length; i++) {
        swap(i);
      }
    }
    this.state[oface][oindex] = buf;
  }

  private innerCycle(face: Face, inverse: boolean) {
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
    const corners = [0, 2, 8, 6].map(helper);
    const edges = [1, 5, 7, 3].map(helper);
    this.stickerCycle(corners, inverse);
    this.stickerCycle(edges, inverse);
  }

  private _turnFace(face: Face, inverse: boolean): this {
    // step 1, rotate the face
    this.innerCycle(face, inverse);

    // step 2, rotate the surrounding faces
    const cycles = faceToCycles[face];
    for (const cycle of cycles) {
      this.stickerCycle(cycle, inverse);
    }
    return this;
  }

  turnFace(face: Face, turns: number): this {
    if (turns === 0) {
      return this;
    }
    const inverse = turns == 3;
    if (turns == 3) {
      turns = 1;
    }
    for (let i = 0; i < turns; i++) {
      this._turnFace(face, inverse);
    }
    return this;
  }

  // e.g. for x
  // c0 = f2f[U][B]
  // c1 = f2f[B][D]
  // c2 = f2f[D][F]
  // c3 = f2f[F][U]
  // sU = 0..=8
  // sB = c0[sU]
  // sD = c1[sB]
  // sF = c2[sD]
  // vU = c3[sF]
  // assert sU == vU
  // cycle sU -> sB -> sD -> sF -> sU/vU

  rotateCube(rotation: Rotation, inverse: boolean) {
    const faces = rotationToCycle[rotation];
    for (let i = 0; i < 9; i++) {
      const cycle: Sticker[] = [];
      let prev;
      let curr;
      let ind;
      for (let j = 0; j < 4; j++) {
        curr = faces[j]!;
        if (j === 0) {
          ind = i;
        } else {
          ind = faceToFace[prev!][curr]![ind!]!;
        }
        cycle.push([curr, ind]);
        prev = curr;
      }
      this.stickerCycle(cycle, inverse);
    }
    const wings = rotationToWings[rotation];
    this.innerCycle(wings[0]!, inverse);
    this.innerCycle(wings[1]!, !inverse);
  }

  private _rotateCube(rotation: Rotation, turns: number) {
    const inverse = turns === 3;
    if (turns === 3) {
      turns = 1;
    }
    for (let i = 0; i < turns; i++) {
      this.rotateCube(rotation, inverse);
    }
  }

  setMask(mask: Sticker[] | null): this {
    // don't cube rotations break this?
    for (const face in this.state) {
      for (let i = 0; i < 9; i++) {
        this.state[face as Face][i]!.mask = false;
      }
    }
    if (mask === null) {
      return this;
    }
    for (const [face, ind] of mask) {
      this.state[face][ind]!.mask = true;
    }
    return this;
  }

  static allStickers(): Sticker[] {
    return Object.values(Face).flatMap(f =>
      [...Array(9).keys().map(i => [f, i] as Sticker)]
    );
  }

  maskAll(): this {
    return this.setMask(Cube.allStickers());
  }
}
