export function AlgSelector() {
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
  const inputs = cases.map(
    (title, i) =>
    <div>
      <input name={`${i}`} id={`${i}`} type="checkbox"/>
      <label htmlFor={`${i}`}>{title}</label>
    </div>
  );
  return <div>{inputs}</div>;
}
