export const useWait = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))
