export const ID_DOCUMENT_TYPE = {
  UNKNOWN: {
    name: "Unknown",
    keyArr: [],
  },
  DRIVER_LICENCE: {
    name: "Drivers Licence",
    keyArr: ["DRIVER", "LICENCE"],
  },
  HEAVY_VEHICLE: {
    name: "Heavy Vehicle Licence",
    keyArr: ["HEAVY", "VEHICLE"],
  },
  PHOTO_CARD: {
    name: "Photo Card",
    keyArr: ["PHOTO", "CARD"],
  },
  LEARNER_MEMBER: {
    name: "Learners Member",
    keyArr: ["LEARNER", "MEMBER"],
  },
} satisfies Record<string, {name: string; keyArr: string[]}>

export const ID_DOCUMENT_REGION = {
  WESTERN_AUSTRALIA: {
    name: "Western Australia",
    keyArr: ["WESTERN", "AUSTRALIA"],
  },
} satisfies Record<string, {name: string; keyArr: string[]}>
