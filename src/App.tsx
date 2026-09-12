import { AlgSelector } from "./AlgSelector";
import { CubeRenderer } from "./CubeRenderer";
import "./index.css";

export function App() {
  return (
    <div className="app">
      <h1>Straughan</h1>
      <AlgSelector />
      <CubeRenderer />
    </div>
  );
}

export default App;
