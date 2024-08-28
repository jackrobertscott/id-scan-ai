import {join} from "path"
import {srvConf} from "../srvConf"

const createS3Path = (...folders: string[]) => {
  return join(srvConf.AWS_S3_BUCKET_FOLDER, ...folders)
}

export const BUCKET_FOLDERS = {
  TAGS_PATRONS_FACE: createS3Path("tags", "patrons", "face"),
  TAGS_DOCUMENTS_FACE: createS3Path("tags", "documents", "face"),
  PATRON_PHOTOS_FULL: createS3Path("patrons", "full"),
  PATRON_PHOTOS_FACE: createS3Path("patrons", "face"),
  DOCUMENT_PHOTOS_FULL: createS3Path("documents", "full"),
  DOCUMENT_PHOTOS_FACE: createS3Path("documents", "face"),
  USERS_FULL: createS3Path("users", "full"),
  USERS_FACE: createS3Path("users", "face"),
  PDF_EXPORTS: createS3Path("pdfExports"),
}
