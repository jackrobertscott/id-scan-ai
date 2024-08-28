import {css} from "@emotion/css"
import {createCns} from "../../utils/classNames"

export const gcn = createCns({
  grow: css({flexGrow: 1}),
  shrink: css({flexShrink: 1}),
  elevate: css`
    box-shadow: inset 2px 2px 0 0 hsl(0, 0%, 0%, 0.25),
      inset -2px -2px 0 0 hsl(0, 0%, 100%, 0.25);
  `,
  depress: css`
    box-shadow: inset 2px 2px 0 0 hsl(0, 0%, 100%, 0.25),
      inset -2px -2px 0 0 hsl(0, 0%, 0%, 0.25);
  `,
})
