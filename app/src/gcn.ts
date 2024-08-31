import {css} from "@emotion/css"
import {createCns} from "./utils/classNames"

export const gcn = createCns("Global", {
  grow: css({flexGrow: 1}),
  shrink: css({flexShrink: 1}),
  zeroBasis: css({flexBasis: 0}),
  row: css({flexDirection: "row"}),
  column: css({flexDirection: "column"}),
  overAuto: css({overflow: "auto"}),
})
