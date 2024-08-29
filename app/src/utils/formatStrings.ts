export function formatFullName(data: {
  firstName?: string | null
  lastName?: string | null
}): string {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim()
  return name || "Anonymous"
}
