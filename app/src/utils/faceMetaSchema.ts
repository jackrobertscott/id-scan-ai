import {z} from "zod"

export type FaceMetaSchema = z.infer<ReturnType<typeof faceMetaSchema>>

export const faceEmotionOptions = [
  "HAPPY",
  "SAD",
  "ANGRY",
  "CONFUSED",
  "DISGUSTED",
  "SURPRISED",
  "CALM",
  "UNKNOWN",
  "FEAR",
]

export const faceMetaSchema = () =>
  z.object({
    boundingBox: z.object({
      top: z.number(),
      left: z.number(),
      width: z.number(),
      height: z.number(),
      angle: z.number(),
      confidence: z.number(),
    }),
    pose: z.object({
      roll: z.number(),
      yaw: z.number(),
      pitch: z.number(),
    }),
    quality: z.object({
      brightness: z.number(),
      sharpness: z.number(),
    }),
    gender: z.optional(
      z.object({
        value: z.string().toUpperCase(),
        confidence: z.number(),
      })
    ),
    ageRange: z.optional(
      z.object({
        low: z.number(),
        high: z.number(),
      })
    ),
    smile: z.optional(
      z.object({
        value: z.boolean(),
        confidence: z.number(),
      })
    ),
    eyeglasses: z.optional(
      z.object({
        value: z.boolean(),
        confidence: z.number(),
      })
    ),
    sunglasses: z.optional(
      z.object({
        value: z.boolean(),
        confidence: z.number(),
      })
    ),
    beard: z.optional(
      z.object({
        value: z.boolean(),
        confidence: z.number(),
      })
    ),
    mustache: z.optional(
      z.object({
        value: z.boolean(),
        confidence: z.number(),
      })
    ),
    eyesOpen: z.optional(
      z.object({
        value: z.boolean(),
        confidence: z.number(),
      })
    ),
    mouthOpen: z.optional(
      z.object({
        value: z.boolean(),
        confidence: z.number(),
      })
    ),
    primaryEmotion: z.optional(
      z.object({
        value: z.string().toUpperCase(),
        confidence: z.number(),
      })
    ),
    faceOccluded: z.optional(
      z.object({
        // high face occlusion value => delete image & try again
        value: z.boolean(),
        confidence: z.number(),
      })
    ),
    eyeDirection: z.optional(
      z.object({
        yaw: z.number(),
        pitch: z.number(),
        confidence: z.number(),
      })
    ),
  })
