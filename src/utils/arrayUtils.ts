type ArrayValue<T> = T | Array<ArrayValue<T>>;

export function flatten<T = unknown>(value: Array<ArrayValue<T>>): Array<T> {
  const res = new Array<T>();
  function flat(val: ArrayValue<T>) {
    if (!Array.isArray(val)) {
      res.push(val);
      return;
    }
    for (const v of val) {
      flat(v);
    }
  }
  for (const val of value) {
    flat(val);
  }
  return res;
}

export function shuffle<T = unknown>(arr: Array<T>): Array<T> {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}
