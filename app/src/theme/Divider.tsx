import {css} from "@emotion/css"
import {gcn} from "../gcn"
import {prettyCns} from "../utils/classNames"

export const Divider = () => {
  return <div className={cn_d.root} />
}

const cn_d = prettyCns("Divider", {
  root: css`
    ${gcn.divider}
    flex-shrink: 0;
  `,
})
