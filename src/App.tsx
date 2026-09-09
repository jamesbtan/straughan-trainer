import { APITester } from "./APITester";
import { CubeRenderer } from "./CubeRenderer";
import "./index.css";

export function App() {
  return (
    <div className="app">
      <h1>Straughan</h1>
      <CubeRenderer />
      <APITester />
    </div>
  );
}

export default App;
