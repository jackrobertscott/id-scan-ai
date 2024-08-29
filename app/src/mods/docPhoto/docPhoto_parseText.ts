import {ID_DOCUMENT_REGION, ID_DOCUMENT_TYPE} from "../../consts/ID_DOCUMENT"
import {WA_POST_CODE_ARRAY} from "../../consts/WA_POST_CODES"
import {ScanType} from "../scan/scan_storeDef.iso"
import {parseDOB} from "./docPhoto_parseDob"

export function parseDocText(
  text?: string | null
): Partial<ScanType["docMeta"]> {
  if (!text) return {}
  const meta = getIDTypeFromText(text)
  let licenceNo: string | undefined
  let postCode: string | undefined
  let suburb: string | undefined
  if (meta.documentRegion === "WESTERN_AUSTRALIA") {
    let wordArr = text.split(/\W/) // split on any non-alphanumeric
    for (const word of wordArr) {
      if (/^6\d{3}$/i.test(word)) {
        postCode = word
      } else if (/^\d{7}$/i.test(word)) {
        if (!licenceNo || +licenceNo.charAt(0) < +word.charAt(0)) {
          licenceNo = word
        }
      }
    }
    if (postCode) {
      const suburbObjects = WA_POST_CODE_ARRAY.filter((i) => {
        return i.code === postCode
      })
      const suburbObject = suburbObjects.find((s) => {
        return new RegExp(s.name, "i").test(text)
      })
      if (suburbObject) {
        suburb = suburbObject.name
      }
    }
  }
  return {
    ...meta,
    licenceNo,
    postCode,
    suburb,
    birthDate: parseDOB(text),
  }
}

function getIDTypeFromText(text?: string | null) {
  let documentType: keyof typeof ID_DOCUMENT_TYPE | undefined
  let documentRegion: keyof typeof ID_DOCUMENT_REGION | undefined
  if (text) {
    if (ID_DOCUMENT_TYPE.PHOTO_CARD.keyArr.every(wordIsInText(text))) {
      documentType = "PHOTO_CARD"
    } else if (
      ID_DOCUMENT_TYPE.LEARNER_MEMBER.keyArr.every(wordIsInText(text))
    ) {
      documentType = "LEARNER_MEMBER"
    } else if (
      ID_DOCUMENT_TYPE.DRIVER_LICENCE.keyArr.every(wordIsInText(text))
    ) {
      if (ID_DOCUMENT_TYPE.HEAVY_VEHICLE.keyArr.every(wordIsInText(text))) {
        documentType = "HEAVY_VEHICLE"
      } else {
        documentType = "DRIVER_LICENCE"
      }
    }
    if (ID_DOCUMENT_REGION.WESTERN_AUSTRALIA.keyArr.every(wordIsInText(text))) {
      documentRegion = "WESTERN_AUSTRALIA"
    }
  }
  return {
    documentType,
    documentRegion,
  }
}

function wordIsInText(text: string) {
  return function (word: string) {
    return new RegExp(word, "i").test(text)
  }
}
