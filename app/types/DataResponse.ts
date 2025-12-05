export interface DataResponse<T> {
  data: T;
  error?: string | Error;
}
