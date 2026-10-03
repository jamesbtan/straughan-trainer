type CanonicalAlg = {
  alg: string;
  aufs: [number, number][];
  two_gen?: true;
};

export const CANONICAL_ALGS: CanonicalAlg[] = [
  {
    alg: "R U R' F' R U R' U' R' F R2 U' R'",
    aufs: [
      [1, 12],
      [0, 6],
      [0, 12],
      [2, 0],
    ],
  },
  {
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    aufs: [[1, 6]],
  },
  {
    alg: "R U R' U R U' R' U R U2' R'",
    aufs: [
      [0, 6],
      [3, 1],
    ],
    two_gen: true,
  },
  {
    alg: "r U' r2' D' r U' r' D r2 U r'",
    aufs: [
      [0, 11],
      [1, 1],
      [1, 10],
      [3, 6],
    ],
  },
  {
    alg: "R U2' R2' F R F' U2 R' F R F'",
    aufs: [
      [3, 1],
      [2, 10],
      [1, 0],
      [3, 11],
    ],
  },
  {
    alg: "F U R U' R' U R U' R' U R U' R' F'",
    aufs: [
      [2, 0],
      [3, 1],
    ],
  },
  {
    alg: "R U2 R2 U' R2 U' R2 U2 R",
    aufs: [
      [2, 6],
      [1, 4],
      [0, 1],
      [3, 5],
    ],
    two_gen: true,
  },
  {
    alg: "F R' F' R U2 R U' R' U R U2' R'",
    aufs: [
      [3, 12],
      [0, 2],
      [2, 9],
      [2, 5],
    ],
  },
  {
    alg: "R' F R U F U' R U R' U' F'",
    aufs: [
      [3, 9],
      [3, 6],
      [2, 9],
      [1, 0],
    ],
  },
  {
    alg: "R U2' R' U' R U R' U2' R' F R F'",
    aufs: [
      [3, 3],
      [1, 12],
      [1, 4],
      [0, 9],
    ],
  },
  {
    alg: "r U' r2' D' r U r' D r2 U r'",
    aufs: [
      [1, 12],
      [1, 1],
      [2, 12],
      [3, 1],
    ],
  },
  {
    alg: "R' U' R' F R F' R U' R' U2 R",
    aufs: [
      [0, 3],
      [1, 0],
      [2, 2],
      [3, 1],
    ],
  },
  {
    alg: "R' U' R U' R' U2' R2 U R' U R U2' R'",
    aufs: [
      [0, 3],
      [3, 0],
      [2, 2],
      [1, 6],
    ],
    two_gen: true,
  },
  {
    alg: "F R2 D R' U R D' R2' U' F'",
    aufs: [
      [0, 14],
      [0, 0],
      [3, 13],
      [2, 1],
    ],
  },
  {
    alg: "R2 D R' U2 R D' R' U2 R'",
    aufs: [
      [0, 10],
      [0, 2],
      [1, 14],
      [2, 8],
    ],
  },
  {
    alg: "r U' r' U r' D' r U' r' D r",
    aufs: [
      [0, 10],
      [1, 6],
      [1, 11],
      [3, 6],
    ],
  },
  {
    alg: "R2' D' R U2 R' D R U2 R",
    aufs: [
      [3, 11],
      [2, 7],
      [0, 13],
      [0, 3],
    ],
  },
  {
    alg: "F R U R' U' F'",
    aufs: [
      [2, 1],
      [3, 7],
      [0, 6],
      [1, 8],
    ],
  },
  {
    alg: "R U2' R' U' R U' R2' U2' R U R' U R",
    aufs: [
      [0, 7],
      [3, 0],
      [2, 8],
      [1, 1],
    ],
    two_gen: true,
  },
  {
    alg: "r U' r' U' F R' F' R2 U' R'",
    aufs: [
      [1, 10],
      [1, 0],
      [0, 11],
      [3, 0],
    ],
  },
  {
    alg: "L' U' L U r U' r' F",
    aufs: [
      [0, 8],
      [2, 10],
      [3, 4],
      [3, 14],
    ],
  },
  {
    alg: "r' D' r U r' D r U' r U r'",
    aufs: [
      [1, 13],
      [1, 1],
      [0, 14],
      [3, 6],
    ],
  },
  {
    alg: "R U R' U' R' F R F'",
    aufs: [
      [3, 5],
      [3, 11],
      [1, 7],
      [0, 13],
    ],
  },
  {
    alg: "r U' r2' D' r U2 r' D r2 U r'",
    aufs: [
      [2, 4],
      [3, 0],
      [0, 5],
      [1, 6],
    ],
  },
  {
    alg: "R U R' U R U2' R'",
    aufs: [
      [2, 2],
      [1, 5],
      [0, 5],
      [3, 7],
    ],
    two_gen: true,
  },
  {
    alg: "F R' F' R U2 R U2' R'",
    aufs: [
      [0, 14],
      [2, 2],
      [1, 10],
      [0, 3],
    ],
  },
  {
    alg: "R U R' U R U' R D R' U' R D' R2",
    aufs: [
      [1, 14],
      [0, 4],
      [0, 10],
      [2, 5],
    ],
  },
  {
    alg: "r U' r' F R' F' R",
    aufs: [
      [2, 7],
      [2, 11],
      [0, 5],
      [3, 10],
    ],
  },
  {
    alg: "L' U2 L U2' r U' r' F",
    aufs: [
      [3, 7],
      [2, 11],
      [1, 3],
      [1, 10],
    ],
  },
  {
    alg: "R U R' U R' F R F' R U2' R'",
    aufs: [
      [2, 3],
      [3, 3],
      [0, 7],
      [1, 4],
    ],
  },
  {
    alg: "R' U' R U' R' U2' R",
    aufs: [
      [2, 3],
      [1, 8],
      [0, 4],
      [3, 4],
    ],
    two_gen: true,
  },
  {
    alg: "F' r U r' U2' L' U2 L",
    aufs: [
      [0, 11],
      [0, 3],
      [3, 13],
      [2, 2],
    ],
  },
  {
    alg: "R U2' R' U2 R' F R F'",
    aufs: [
      [1, 2],
      [3, 10],
      [3, 8],
      [0, 11],
    ],
  },
  {
    alg: "R' F R F' r U r'",
    aufs: [
      [2, 4],
      [3, 10],
      [0, 8],
      [2, 11],
    ],
  },
  {
    alg: "R2 D R' U R D' R' U R' U' R U' R'",
    aufs: [
      [3, 5],
      [3, 13],
      [1, 4],
      [2, 11],
    ],
  },
  {
    alg: "R U2' R' F R' F' R U' R U' R'",
    aufs: [
      [2, 8],
      [3, 2],
      [0, 2],
      [1, 5],
    ],
  },
  {
    alg: "R U R' U R U' R' U R U' R' U R U2' R'",
    aufs: [
      [2, 7],
      [1, 8],
      [0, 3],
      [3, 2],
    ],
    two_gen: true,
  },
  {
    alg: "R U2 R D R' U2 R D' R2'",
    aufs: [
      [3, 8],
      [2, 9],
      [1, 7],
      [1, 12],
    ],
  },
  {
    alg: "F R' F' R U R U' R'",
    aufs: [
      [1, 12],
      [0, 4],
      [2, 12],
      [2, 3],
    ],
  },
  {
    alg: "F R U' R' U' R U R' F'",
    aufs: [
      [3, 12],
      [1, 2],
      [2, 12],
      [3, 5],
    ],
  },
  {
    alg: "R' U2 R' D' R U2 R' D R2",
    aufs: [
      [1, 7],
      [0, 12],
      [3, 8],
      [3, 9],
    ],
  },
  {
    alg: "R U2' R2' F R F' R U2' R'",
    aufs: [
      [0, 4],
      [1, 7],
      [2, 8],
      [3, 5],
    ],
  },
];

export type InverseElement = {
  pre_auf: number;
  post_auf: number;
  alg_id: number;
};
type InverseMap = InverseElement[][];
export const INVERSE_MAP: InverseMap = CANONICAL_ALGS.flatMap(({ aufs }, alg_id) =>
  aufs.map(([post_auf, group], pre_auf): [number, InverseElement] => [
    group,
    {
      pre_auf: pre_auf,
      post_auf: post_auf,
      alg_id: alg_id,
    },
  ]),
).reduce<InverseMap>(
  (a, [g, e]) => {
    if (a[g] === undefined) {
      a[g] = [];
    }
    a[g].push(e);
    return a;
  },
  Array.from({ length: 15 }),
);
