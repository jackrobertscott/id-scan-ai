export type Primitive = string | number | boolean | null | undefined

export type MergeObjects<A, B> = Omit<A, keyof B> & B

export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

export type IncludeOfType<X, T> = {
  [K in keyof X as T extends X[K] ? K : never]: X[K]
}

export type ExcludeOfType<X, T> = {
  [K in keyof X as T extends X[K] ? never : K]: X[K]
}

export type OptionalUndefined<X> = Simplify<
  ExcludeOfType<X, undefined> & Partial<IncludeOfType<X, undefined>>
>

export type Simplify<A> = A extends (infer X)[]
  ? Simplify<X>[]
  : A extends object
  ? {[K in keyof A]: Simplify<A[K]>}
  : A

export type Coerce<T, V> = V extends T ? V : never

export type Narrowable =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | null
  | undefined
  | object
  | {}
  | []
  | void

export type DeepNullable<T extends object> = {
  [K in keyof T]?:
    | (T[K] extends object ? DeepNullable<T[K]> : T[K])
    | undefined
    | null
}

export type Writeable<T> = {-readonly [P in keyof T]: Writeable<T[P]>}

export type NestedKeyOf<T> = {
  [K in keyof T]-?: T[K] extends Primitive
    ? `${K & (string | number)}`
    : T[K] extends Array<infer U>
    ? U extends object
      ?
          | `${K & (string | number)}`
          | `${K & (string | number)}.${NestedKeyOf<U>}`
      : `${K & (string | number)}`
    : T[K] extends object
    ?
        | `${K & (string | number)}`
        | `${K & (string | number)}.${NestedKeyOf<T[K]>}`
    : `${K & (string | number)}`
}[keyof T]

export type NestedPropertyOf<
  T extends object,
  S extends string | number
> = T extends Array<infer U>
  ? U extends object
    ? NestedPropertyOf<U, S>
    : U
  : T extends object
  ? S extends `${infer A}.${infer B}`
    ? A extends keyof T
      ? T[A] extends object
        ? NestedPropertyOf<T[A], B>
        : T[A]
      : never
    : S extends keyof T
    ? T[S]
    : never
  : never
