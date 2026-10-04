import { Title } from "@solidjs/meta";
import { CubeRenderer } from "../components/CubeRenderer";
import { AlgSelector } from "../components/AlgSelector";
import { CubeProvider } from "../hooks/useCube";
import { StatusBar } from "../components/StatusBar";
import { CubeScrambler } from "../components/CubeScrambler";

export default function Home() {
  return (
    <main>
      <Title>Home - Solid App</Title>
      <CubeProvider>
        <StatusBar />
        <AlgSelector />
        <CubeScrambler />
        <CubeRenderer />
      </CubeProvider>
    </main>
  );
}
