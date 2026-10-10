import * as Cube from "./Cube";

const slice: Record<Cube.Slice, Cube.Move[]> = {
  [Cube.Slice.S]: [
    [Cube.Face.F, 3],
    [Cube.Face.B, 1],
    [Cube.Rotation.z, 1],
  ],
  [Cube.Slice.E]: [
    [Cube.Face.U, 3],
    [Cube.Face.D, 1],
    [Cube.Rotation.y, 1],
  ],
  [Cube.Slice.M]: [
    [Cube.Face.R, 1],
    [Cube.Face.L, 3],
    [Cube.Rotation.x, 3],
  ],
};

const wide: Record<Cube.Face, Cube.Move[]> = {
  [Cube.Face.F]: [
    [Cube.Face.B, 1],
    [Cube.Rotation.z, 1],
  ],
  [Cube.Face.B]: [
    [Cube.Face.F, 1],
    [Cube.Rotation.z, 3],
  ],
  [Cube.Face.L]: [
    [Cube.Face.R, 1],
    [Cube.Rotation.x, 3],
  ],
  [Cube.Face.R]: [
    [Cube.Face.L, 1],
    [Cube.Rotation.x, 1],
  ],
  [Cube.Face.U]: [
    [Cube.Face.D, 1],
    [Cube.Rotation.y, 1],
  ],
  [Cube.Face.D]: [
    [Cube.Face.U, 1],
    [Cube.Rotation.y, 3],
  ],
};

export class Alg {
  moves: Cube.Move[];

  constructor(algStr?: string) {
    if (algStr !== undefined) {
      this.moves = algStr.split(" ").flatMap(stringToMoves);
    } else {
      this.moves = [];
    }
  }

  private pushMove(move: [Cube.Face, number] | Cube.Move) {
    move[1] %= 4;
    if (move[1] !== 0) {
      this.moves.push(move as Cube.Move);
    }
  }

  static fromMoves(moves: ([Cube.Face, number] | Cube.Move)[]): Alg {
    let alg = new Alg();
    alg.andThen(moves);
    return alg;
  }

  invert(): Alg {
    this.moves.reverse();
    for (let move of this.moves) {
      mult(move, 3);
    }
    return this;
  }

  andThen(moves: ([Cube.Face, number] | Cube.Move)[]): Alg {
    for (const move of moves) {
      this.pushMove(move);
    }
    return this;
  }
}

function mult(r: Cube.Move, x: number) {
  r[1] *= x;
  r[1] %= 4;
  return r;
}

function stringToMoves(move: string): Cube.Move[] {
  if (move.length == 0) {
    throw new Error("Invalid move");
  }
  const initial = move[0]!;
  let result;
  if (Cube.isRotation(initial) || Cube.isFace(initial)) {
    result = [[initial, 1] as Cube.Move];
  } else if (Cube.isSlice(initial)) {
    result = slice[initial].map((m) => [...m] as Cube.Move);
  } else {
    const upper = initial.toUpperCase();
    if (!Cube.isFace(upper)) {
      throw new Error("Invalid move");
    }
    result = wide[upper].map((m) => [...m] as Cube.Move);
  }
  if (move.length == 1) {
    return result;
  }
  switch (move.substring(1)) {
    case "2":
    case "2'":
      return result.map((r) => mult(r, 2));
    case "'":
      return result.map((r) => mult(r, 3));
    default:
      throw new Error("Invalid turn");
  }
}
