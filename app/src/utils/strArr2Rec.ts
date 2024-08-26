export const strArr2Rec = <T extends readonly string[]>(arr: T) => {
  return arr.reduce(
    (all, key) => ({...all, [key]: key}),
    {} as {
      [key in T[number]]: string
    }
  )
}
