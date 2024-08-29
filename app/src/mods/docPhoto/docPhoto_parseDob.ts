import {DATETIME_MONTHS} from "../../consts/DATETIME"

export const DATE_NUM_REGEX =
  /^[0-3]?[0-9][ ]*[-/.]+[ ]*[0-9]{1,2}[ ]*[-/.]+[ ]*(20|19)?[0-9]{2}\b/i
export const DATE_ALPHA_REGEX =
  /^[0-3]?[0-9][ ]+([a-z]{3,}[ ]*[/][ ]*)?[a-zÀ-ÿ]{3,}[ ]+(20|19)?[0-9]{2}\b/i

export const parseDOB = (raw?: string | null) => {
  if (!raw) return undefined
  const wordArr = raw.toUpperCase().split(" ")
  const isUsaLicense = wordArr.includes("USA") && wordArr.includes("LICENSE")
  const monthArr = DATETIME_MONTHS.map((i) => i.toUpperCase())
  const filteredWordArr = wordArr.filter((i) => {
    if (i.match(/[a-z]/gi) === null) return true
    if (i.length < 3) return false
    return monthArr.some((j) => {
      return j.startsWith(i.slice(0, 3)) || j.startsWith(i.slice(-3))
    })
  })
  let rawArr: (string | undefined)[] = []
  while (filteredWordArr.length) {
    const filteredText = filteredWordArr.join(" ")
    rawArr.push(filteredText.match(DATE_NUM_REGEX)?.[0])
    rawArr.push(filteredText.match(DATE_ALPHA_REGEX)?.[0])
    filteredWordArr.shift()
  }
  let dateArr = rawArr.filter(Boolean) as string[]
  dateArr = dateArr.map((i) => {
    // new Date() only accepts: "m/d/y" or "y/m/d"
    let arr = i
      .replace(/[- /.]/gi, " ")
      .split(" ")
      .filter(Boolean)
    if (arr.length === 4) {
      // foreign month
      if (monthArr.some((i) => i.startsWith(arr[1]))) arr.splice(2, 1)
      else arr.splice(1, 1)
    }
    if (arr[arr.length - 1].length === 4) {
      if (isUsaLicense) arr = [arr[1], arr[0], arr[2]]
      arr = arr.reverse() // "yyyy/mm/dd"
    } else if (!isUsaLicense) {
      arr = [arr[1], arr[0], arr[2]] // "mm/dd/yy"
    }
    return arr.join(" ")
  })
  const minAge = new Date()
  minAge.setFullYear(minAge.getFullYear() - 15)
  return dateArr
    ?.map((i) => new Date(i))
    .filter((i) => i.valueOf())
    .filter((i) => minAge.valueOf() - i.valueOf() > 0)
    .sort((a, b) => a.valueOf() - b.valueOf())[0]
}

export const dateDiff = (t?: Date, c: Date = new Date()) => {
  if (!t) return undefined
  let dy = c.getFullYear() - t.getFullYear()
  let dm = c.getMonth() - t.getMonth()
  let dd = c.getDate() - t.getDate()
  let t2 = new Date(t.valueOf())
  t2.setFullYear(c.getFullYear())
  if (t2.valueOf() > c.valueOf()) dy = dy - 1
  t2.setMonth(c.getMonth())
  if (t2.valueOf() > c.valueOf()) dm = dm - 1
  if (dm < 0) dm = 12 + dm
  t2 = new Date(c.getFullYear(), c.getMonth(), 0)
  if (dd < 0) dd = c.getDate() + (t2.getDate() - t.getDate()) // number of days since birth of previous month
  return [dy, dm, dd] // years, months, days
}
