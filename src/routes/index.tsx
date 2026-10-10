import { Title } from "@solidjs/meta";
import { CubeRenderer } from "../components/CubeRenderer";
import { AlgSelector } from "../components/AlgSelector";
import { StatusBar } from "../components/StatusBar";
import { Cube, Face } from "../types/Cube";
import { createCubeCtx, CubeStore, CubeContext } from "../hooks/useCube";

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

function _reset(self: CubeStore) {
  self.cube.setSolved();
  if (self.scramble === undefined) {
    return;
  }
  self.cube.setMask(F2B_W_STRAUGHAN);
  self.cube.apply(self.scramble);
}

export default function Home() {
  const cubeContext = createCubeCtx({
    cube: new Cube(),
    reset: _reset,
  });

  return (
    <main>
      <Title>Home - Solid App</Title>
      <CubeContext value={cubeContext}>
        <StatusBar />
        <AlgSelector />
        <CubeRenderer />
      </CubeContext>
    </main>
  );
}
