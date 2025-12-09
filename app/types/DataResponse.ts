export interface ErrorResponse {
  error?: string | Error;
}

export interface DataResponse<T> {
  data: T | null;
}

export type AppResponse<T> = DataResponse<T> & ErrorResponse;
