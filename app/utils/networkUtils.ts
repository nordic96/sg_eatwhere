import { DataResponse } from '../types';

export async function fetchApi<T>(url: string): Promise<DataResponse<T>> {
  const data = fetch(url, {
    cache: 'no-store',
  }).then((r) => r.json());
  return data as Promise<DataResponse<T>>;
}
