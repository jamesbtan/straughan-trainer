import { useEffect, useState } from "react";

import styles from './CubeRenderer.module.css';
import * as c from './Cube.ts';

const colors = {
  [c.Face.U]: styles.c_yellow,
  [c.Face.D]: styles.c_white,
  [c.Face.F]: styles.c_green,
  [c.Face.B]: styles.c_blue,
  [c.Face.L]: styles.c_orange,
  [c.Face.R]: styles.c_red,
}


export function CubeRenderer() {
  let [cube, setCube] = useState(c.getCube());

  function handleKeydown(e: KeyboardEvent) {
    console.log(e);
    // TODO swap to keyCode
    switch (e.key) {
      case "w":
        console.log(cube);
        return setCube({...c.alg(cube, "B")});
      case "e":
        return setCube({...c.alg(cube, "L'")});
      case "i":
        return setCube({...c.alg(cube, "R")});
      case "o":
        return setCube({...c.alg(cube, "B'")});
      case "s":
        return setCube({...c.alg(cube, "D")});
      case "d":
        return setCube({...c.alg(cube, "L")});
      case "f":
        return setCube({...c.alg(cube, "U'")});
      case "g":
        return setCube({...c.alg(cube, "F'")});
      case "h":
        return setCube({...c.alg(cube, "F")});
      case "j":
        return setCube({...c.alg(cube, "U")});
      case "k":
        return setCube({...c.alg(cube, "R'")});
      case "l":
        return setCube({...c.alg(cube, "D'")});
      case "x":
        // M'
      case ",":
        // M'
      case "5":
        // M
      case "6":
        // M
      case "u":
        // Rw
      case "m":
        // Rw'
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
    <rect width="240" height="240" rx="14" className={styles.bg} />

    { // back
      Array(3).keys().map(i =>
        <rect x={52 + (2-i)*48} y="28" width="40" height="12" className={`${styles.facelet} ${colors[cube["state"]["B"][i]!]}`} />
      )
    }

    { // left
      Array(3).keys().map(i =>
        <rect x="28" y={52 + i*48} width="12" height="40" className={`${styles.facelet} ${colors[cube["state"]["L"][i]!]}`} />
      )
    }

    { // right
      Array(3).keys().map(i =>
        <rect x="200" y={52 + (2-i)*48} width="12" height="40" className={`${styles.facelet} ${colors[cube["state"]["R"][i]!]}`} />
      )
    }

    { // front
      Array(3).keys().map(i =>
        <rect x={52 + i*48} y="200" width="40" height="12" className={`${styles.facelet} ${colors[cube["state"]["F"][i]!]}`} />
      )
    }

    { // up
      Array(3).keys().flatMap(i => {
        return Array(3).keys().map(j =>
          <rect x={52 + j*48} y={52 + i*48} width="40" height="40" className={`${styles.facelet} ${colors[cube["state"]["U"][3*i+j]!]}`} />
        )
      })
    }
  </svg>;
}
