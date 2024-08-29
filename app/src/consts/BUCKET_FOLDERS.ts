import {join} from "path"
import {srvConf} from "../srvConf"

const createS3Path = (...folders: string[]) => {
  return join(srvConf.AWS_S3_BUCKET_FOLDER, ...folders)
}

export const BUCKET_FOLDERS = {
  TAGS_PATRONS_FACE: createS3Path("tag", "live", "face"),
  TAGS_DOCUMENTS_FACE: createS3Path("tag", "doc", "face"),
  PATRON_PHOTOS_FULL: createS3Path("live", "full"),
  PATRON_PHOTOS_FACE: createS3Path("live", "face"),
  DOCUMENT_PHOTOS_FULL: createS3Path("doc", "full"),
  DOCUMENT_PHOTOS_FACE: createS3Path("doc", "face"),
  USERS_FULL: createS3Path("user", "full"),
  USERS_FACE: createS3Path("user", "face"),
  PDF_EXPORTS: createS3Path("pdf_export"),
}
