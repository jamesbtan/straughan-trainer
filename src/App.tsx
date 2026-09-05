import { APITester } from "./APITester";
import { CubeRenderer } from "./CubeRenderer";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

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
