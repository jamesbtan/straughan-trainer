import { Title } from "@solidjs/meta";
import { CubeRenderer } from "../components/CubeRenderer";
import { AlgSelector } from "../components/AlgSelector";

export default function Home() {
  return (
    <main>
      <Title>Home - Solid App</Title>
      <h1>Hello Solid!</h1>
      <p>
        Edit <code>src/routes/index.tsx</code> and save to reload.
      </p>
      <a href="https://v2.solidjs.com/" target="_blank" rel="noopener noreferrer">
        Learn Solid
      </a>
      <AlgSelector />
      <CubeRenderer />
    </main>
  );
}
