import {srvConf} from "../srvConf"
import {toPascalCase} from "../utils/changeCase"

const createName = (suffix: string) => {
  return toPascalCase(`${srvConf.AWS_REKOG_COLNAME_PREFIX}${suffix}`)
}

export const AWS_REKOG_COLNAMES = {
  LIVE: createName("Live"),
  DOC: createName("Doc"),
  TAG: createName("Tag"),
  USER: createName("User"),
}
