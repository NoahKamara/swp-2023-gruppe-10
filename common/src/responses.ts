
export type APIError = APIBaseError | APIContextError;

export type APIBaseError = {
  code: number,
  error: unknown,
}

export type APIContextError = {
  code: number,
  error: unknown,
  context: unknown | undefined
}
