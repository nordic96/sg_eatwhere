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
  return arr.sort(() => {
    const val = Math.floor(Math.random() * 2);
    if (val === 0) {
      return -1;
    }
    return 1;
  });
}
