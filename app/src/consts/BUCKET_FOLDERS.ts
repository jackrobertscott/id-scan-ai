import {join} from "path"
import {srvConf} from "../srvConf"

const createS3Path = (folder: string) => {
  return join(srvConf.AWS_S3_BUCKET_FOLDER, folder)
}

export const BUCKET_FOLDERS = {
  TAG_LIVE_FACE: createS3Path("tag_live_face"),
  TAG_DOC_FACE: createS3Path("tag_doc_face"),
  LIVE_PHOTO_FULL: createS3Path("live_full"),
  LIVE_PHOTO_FACE: createS3Path("live_face"),
  DOC_PHOTOS_FULL: createS3Path("doc_full"),
  DOC_PHOTOS_FACE: createS3Path("doc_face"),
  USER_FULL: createS3Path("user_full"),
  USER_FACE: createS3Path("user_face"),
  PDF_EXPORT: createS3Path("pdf_export"),
}
