import { Title } from "@solidjs/meta";
import { CubeRenderer } from "../components/CubeRenderer";
import { AlgSelector } from "../components/AlgSelector";

export default function Home() {
  return (
    <main>
      <Title>Home - Solid App</Title>
      <AlgSelector />
      <CubeRenderer />
    </main>
  );
}
