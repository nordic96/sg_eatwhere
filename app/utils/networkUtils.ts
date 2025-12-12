import { AppResponse } from '../types';

export async function fetchApi<T>(url: string): Promise<AppResponse<T>> {
  const data = fetch(url, {
    cache: 'no-store',
  })
    .then((r) => r.json())
    .catch((e) => {
      if (e instanceof Error) {
        return { data: null, error: e.message };
      }
    });
  return data as Promise<AppResponse<T>>;
}
