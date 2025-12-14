/**
 * Pick m number of elements in arr and return
 * m <= n
 */
export function generateRandomArr<T>(arr: Array<T>, m: number): Array<T> {
  const n = arr.length;
  if (m === n) return arr;

  const target = Math.min(n, m);
  const random = new Set<number>();
  while (random.size < target) {
    random.add(Math.floor(Math.random() * n));
  }
  return Array.from(random.values()).map((x) => arr[x]);
}
