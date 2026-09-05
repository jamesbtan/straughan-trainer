import styles from './CubeRenderer.module.css';
import * as c from './Cube.ts';
const Faces = "U" | "D" | "F" | "B" | "L" | "R";

const cube = c.getCube();
c.alg(cube, "R U R' F' R U R' U' R' F R2 U' R' U'");

const colors = {
  "U": styles.c_yellow,
  "D": styles.c_white,
  "F": styles.c_green,
  "B": styles.c_blue,
  "L": styles.c_orange,
  "R": styles.c_red,
}

export function CubeRenderer() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
    <rect width="240" height="240" rx="14" className={styles.bg} />

    { // back
      Array(3).keys().map(i =>
        <rect x={52 + (2-i)*48} y="28" width="40" height="12" className={`${styles.facelet} ${colors[cube["B"][i]]}`} />
      )
    }

    { // left
      Array(3).keys().map(i =>
        <rect x="28" y={52 + i*48} width="12" height="40" className={`${styles.facelet} ${colors[cube["L"][i]]}`} />
      )
    }

    { // right
      Array(3).keys().map(i =>
        <rect x="200" y={52 + (2-i)*48} width="12" height="40" className={`${styles.facelet} ${colors[cube["R"][i]]}`} />
      )
    }

    { // front
      Array(3).keys().map(i =>
        <rect x={52 + i*48} y="200" width="40" height="12" className={`${styles.facelet} ${colors[cube["F"][i]]}`} />
      )
    }

    { // up
      Array(3).keys().flatMap(i => {
        return Array(3).keys().map(j =>
          <rect x={52 + j*48} y={52 + i*48} width="40" height="40" className={`${styles.facelet} ${colors[cube["U"][3*i+j]]}`} />
        )
      })
    }
  </svg>;
}
