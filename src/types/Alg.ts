import * as Cube from "./Cube";

const slice: Record<Cube.Slice, Cube.SimpleMove[]> = {
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

const wide: Record<Cube.Face, Cube.SimpleMove[]> = {
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
      this.moves = algStr.split(" ").map(stringToMove);
    } else {
      this.moves = [];
    }
  }

  get simpleMoves(): Cube.SimpleMove[] {
    return this.moves.flatMap(simplify);
  }

  private pushMove(move: Cube.Move) {
    let moveCopy = { ...move };
    moveCopy.count %= 4;
    if (moveCopy.count !== 0) {
      this.moves.push(moveCopy);
    }
  }

  static from(moves: Cube.Move[]): Alg {
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

  andThen(moves: Cube.Move[]): Alg {
    for (const move of moves) {
      this.pushMove(move);
    }
    return this;
  }

  toString(): string {
    return this.moves.map(moveToString).join(" ");
  }
}

function multSimple(r: Cube.SimpleMove, x: number) {
  r[1] *= x;
  r[1] %= 4;
  return r;
}

function mult(r: Cube.Move, x: number) {
  r.count *= x;
  r.count %= 4;
  return r;
}

function stringToMove(move: string): Cube.Move {
  if (move.length == 0) {
    throw new Error("Invalid move");
  }
  const initial = move[0]!;
  let result: Cube.Move;
  if (Cube.isRotation(initial)) {
    result = {
      kind: "rotation",
      move: initial,
      count: 1,
    };
  } else if (Cube.isFace(initial)) {
    result = {
      kind: "face",
      move: initial,
      count: 1,
    };
  } else if (Cube.isSlice(initial)) {
    result = {
      kind: "slice",
      move: initial,
      count: 1,
    };
  } else {
    const upper = initial.toUpperCase();
    if (!Cube.isFace(upper)) {
      throw new Error("Invalid move");
    }
    result = {
      kind: "face",
      move: upper,
      count: 1,
      wide: true,
    };
  }
  if (move.length == 1) {
    return result;
  }
  switch (move.substring(1)) {
    case "2":
    case "2'":
      return mult(result, 2);
    case "'":
      return mult(result, 3);
    default:
      throw new Error("Invalid turn");
  }
}

function simplify(move: Cube.Move): Cube.SimpleMove[] {
  if (move.count !== 1 && move.count !== 2 && move.count !== 3) {
    throw new Error("unreachable");
  }
  switch (move.kind) {
    case "rotation":
      return [[move.move, move.count]];
    case "face":
      if (move.wide) {
        return wide[move.move].map((m) => {
          return multSimple([...m], move.count) as Cube.SimpleMove;
        });
      }
      return [[move.move, move.count]];
    case "slice":
      return slice[move.move].map((m) => {
        return multSimple([...m], move.count) as Cube.SimpleMove;
      });
  }
}

function moveToString(move: Cube.Move): string {
  let initial: string;
  if (move.kind === "face" && move.wide) {
    initial = move.move.toLowerCase();
  } else {
    initial = move.move;
  }
  switch (move.count) {
    case 1:
      return initial;
    case 2:
      return initial + "2";
    case 3:
      return initial + "'";
  }
  throw new Error("unreachable");
}
