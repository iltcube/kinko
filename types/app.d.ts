declare global {
  export type Nullable<T> = T | null
  export type ValueOf<T extends object> = T[keyof T]
  export type DateUTC = `${number}-${number}-${number}T${number}:${number}:${number}Z`
  export type UUIDv7 = `${string}-${string}-7${string}-${8 | 9 | a | b}${string}-${string}`
  export type NullableProperties<T> = {
    [K in keyof T]: Nullable<T[K]>
  }
}

export {}
