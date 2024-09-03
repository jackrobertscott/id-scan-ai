import {AWS_REKOG_COLNAMES} from "../../consts/AWS_REKOG_COLNAMES"
import {BUCKET_FOLDERS} from "../../consts/BUCKET_FOLDERS"
import {s3CropAndUploadFacePhoto} from "../../utils/s3CropAndUploadFacePhoto"
import {s3UploadFullPhoto} from "../../utils/s3UploadFullPhoto"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {serverFileSchema} from "../../utils/server/serverSchemas"
import {ensureUser} from "../auth/auth_jwt"
import {UserStore} from "./user_store"
import {usr_bySlf_eDef} from "./usr_bySlf_eDef.iso"

export default createEdgeGroup(usr_bySlf_eDef, {
  get: async ({request}) => {
    const auth = await ensureUser(request)
    return {
      user: auth.user,
    }
  },

  update: async ({request, body}) => {
    const auth = await ensureUser(request)

    await UserStore.updateOneById(auth.user.id, {
      ...body,
    })
  },

  updateFace: async ({request, body}) => {
    const auth = await ensureUser(request)

    // Extract the photo buffer
    const {buffer: bodyBuffer} = serverFileSchema().parse(body.photoFile)

    // Upload image files and detect face
    const {fullImage, s3FullImage} = await s3UploadFullPhoto(
      bodyBuffer,
      BUCKET_FOLDERS.USER_FULL
    )
    const {awsFaceId, faceMeta, s3FaceImage} = await s3CropAndUploadFacePhoto(
      fullImage,
      s3FullImage,
      BUCKET_FOLDERS.USER_FACE,
      AWS_REKOG_COLNAMES.USER
    )

    await UserStore.updateOneById(auth.user.id, {
      faceAuth: {
        s3FullImage,
        s3FaceImage,
        faceMeta,
        awsFaceId,
        passcode: body.passcode,
      },
    })
  },
})
