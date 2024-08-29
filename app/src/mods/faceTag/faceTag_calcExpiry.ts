import {TAG_TIME_LENGTH_UNITS_OBJ} from "./faceTag_storeDef.iso"

export const faceTag_calcExpiry = (
  startDate: Date,
  timeLengthUnit: string,
  timeLengthValue: number
) => {
  const expiryDate = new Date(startDate)
  switch (timeLengthUnit) {
    case TAG_TIME_LENGTH_UNITS_OBJ.WEEK:
      expiryDate.setDate(expiryDate.getDate() + 7 * timeLengthValue)
      break
    case TAG_TIME_LENGTH_UNITS_OBJ.MONTH:
      expiryDate.setMonth(expiryDate.getMonth() + timeLengthValue)
      break
    case TAG_TIME_LENGTH_UNITS_OBJ.YEAR:
      expiryDate.setFullYear(expiryDate.getFullYear() + timeLengthValue)
      break
  }
  return expiryDate
}
