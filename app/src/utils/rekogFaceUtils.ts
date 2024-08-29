import {
  FaceDetail,
  SearchFacesByImageCommandOutput,
} from "@aws-sdk/client-rekognition"
import {faceMetaSchema} from "./faceMetaSchema"

export function extractFaceIdsFromSearchResults(
  searchResults: SearchFacesByImageCommandOutput
): string[] {
  let ids = searchResults.FaceMatches?.map(({Face}) => Face?.FaceId)
  return (ids?.filter((i) => i) as string[]) ?? []
}

export function remapRekogFace(faceDetails: FaceDetail) {
  return faceMetaSchema().parse({
    boundingBox: {
      top: faceDetails?.BoundingBox?.Top,
      left: faceDetails?.BoundingBox?.Left,
      width: faceDetails?.BoundingBox?.Width,
      height: faceDetails?.BoundingBox?.Height,
      angle: faceDetails?.Pose?.Roll,
      confidence: faceDetails?.Confidence,
    },
    pose: {
      roll: faceDetails?.Pose?.Roll,
      yaw: faceDetails?.Pose?.Yaw,
      pitch: faceDetails?.Pose?.Pitch,
    },
    quality: {
      brightness: faceDetails?.Quality?.Brightness,
      sharpness: faceDetails?.Quality?.Sharpness,
    },
    gender: faceDetails.Gender
      ? {
          value: faceDetails?.Gender?.Value?.toUpperCase(),
          confidence: faceDetails?.Gender?.Confidence,
        }
      : undefined,
    ageRange: faceDetails.AgeRange
      ? {
          low: faceDetails?.AgeRange?.Low,
          high: faceDetails?.AgeRange?.High,
        }
      : undefined,
    smile: faceDetails.Smile
      ? {
          value: faceDetails?.Smile?.Value,
          confidence: faceDetails?.Smile?.Confidence,
        }
      : undefined,
    eyeglasses: faceDetails.Eyeglasses
      ? {
          value: faceDetails?.Eyeglasses?.Value,
          confidence: faceDetails?.Eyeglasses?.Confidence,
        }
      : undefined,
    sunglasses: faceDetails.Sunglasses
      ? {
          value: faceDetails?.Sunglasses?.Value,
          confidence: faceDetails?.Sunglasses?.Confidence,
        }
      : undefined,
    beard: faceDetails.Beard
      ? {
          value: faceDetails?.Beard?.Value,
          confidence: faceDetails?.Beard?.Confidence,
        }
      : undefined,
    mustache: faceDetails.Mustache
      ? {
          value: faceDetails?.Mustache?.Value,
          confidence: faceDetails?.Mustache?.Confidence,
        }
      : undefined,
    eyesOpen: faceDetails.EyesOpen
      ? {
          value: faceDetails?.EyesOpen?.Value,
          confidence: faceDetails?.EyesOpen?.Confidence,
        }
      : undefined,
    mouthOpen: faceDetails.MouthOpen
      ? {
          value: faceDetails?.MouthOpen?.Value,
          confidence: faceDetails?.MouthOpen?.Confidence,
        }
      : undefined,
    primaryEmotion: faceDetails.Emotions
      ? faceDetails.Emotions.map((emotion) => ({
          value: emotion?.Type?.toUpperCase(),
          confidence: emotion?.Confidence,
        })).sort((a, b) => b.confidence! - a.confidence!)[0]
      : undefined,
    faceOccluded: faceDetails.FaceOccluded
      ? {
          value: faceDetails?.FaceOccluded?.Value ?? null,
          confidence: faceDetails?.FaceOccluded?.Confidence ?? null,
        }
      : undefined,
    eyeDirection: faceDetails.EyeDirection
      ? {
          yaw: faceDetails?.EyeDirection?.Yaw,
          pitch: faceDetails?.EyeDirection?.Pitch,
          confidence: faceDetails?.EyeDirection?.Confidence,
        }
      : undefined,
  })
}
