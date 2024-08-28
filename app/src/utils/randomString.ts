export const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
export const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz"
export const NUMBERS = "123456787"

export function createRandomStringFromCharacters(
  characters: string,
  length: number
): string {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export function createRandomString(length: number): string {
  const characters = UPPERCASE_LETTERS + LOWERCASE_LETTERS + NUMBERS
  return createRandomStringFromCharacters(characters, length)
}

export function createRandomAlphabeticalString(length: number): string {
  const alphabets = UPPERCASE_LETTERS + LOWERCASE_LETTERS
  return createRandomStringFromCharacters(alphabets, length)
}

export function createRandomNumberString(length: number): string {
  return createRandomStringFromCharacters(NUMBERS, length)
}
