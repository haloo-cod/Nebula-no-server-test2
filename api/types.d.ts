export interface VercelRequest {
  query: Record<string, string | string[] | undefined>
}

export interface VercelResponse {
  status(code: number): VercelResponse
  send(body: string): VercelResponse
  redirect(url: string): VercelResponse
  setHeader(name: string, value: string): VercelResponse
}
