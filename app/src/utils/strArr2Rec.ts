export const strArr2Rec = <T extends readonly string[]>(arr: T) => {
  return arr.reduce(
    (acc, key) => ({...acc, [key]: key}),
    {} as {
      [key in T[number]]: string
    }
  )
}
