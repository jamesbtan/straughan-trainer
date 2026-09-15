import styles from "./AlgSelector.module.css";
import { ALL_MASK, NUM_CASES, useCaseSelection } from "./useCaseSelection.ts";

const cases = [
  "headlights",
  "towers",
  "sune",
  "anti-sune",
  "bottom",
  "top",
  "opposite",
  "anti-pi",
  "pi",
  "true diag",
  "diag up",
  "diag right",
  "L",
  "S",
  "Z",
];

if (cases.length !== NUM_CASES) {
  throw new Error(
      "expected " + String(NUM_CASES) + " cases, got " + String(cases.length),
    );
}

export function AlgSelector() {
  const { mask, setMask } = useCaseSelection();

  const inputs = cases.map(
    (title, i) => {
      const checked = ((mask >> i) & 1) === 1;
      return (
        <div className={styles.option} key={i}>
          <input
            name={String(i)}
            id={String(i)}
            type="checkbox"
            checked={checked}
            onChange={() => { setMask(mask ^ (1 << i)); }}
          />
          <label htmlFor={String(i)}>{i+1} - {title}</label>
        </div>
      );
    }
  );

  return (
    <details className={styles.dropdown}>
      <summary className={styles.summary}>Select algorithms</summary>
      <div className={styles.actions}>
        <button
          className={styles.selectAll}
          onClick={() => { setMask(mask === ALL_MASK ? 0 : ALL_MASK); }}
        >
          {mask === ALL_MASK ? "Deselect all" : "Select all"}
        </button>
      </div>
      <div className={styles.selector}>{inputs}</div>
    </details>
  );
}
