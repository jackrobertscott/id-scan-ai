import {css} from "@emotion/css"

export const gcn = {
  grow: css({flexGrow: 1}),
  shrink: css({flexShrink: 1}),
  zeroBasis: css({flexBasis: 0}),
  row: css({flexDirection: "row"}),
  column: css({flexDirection: "column"}),
  overAuto: css({overflow: "auto"}),
  elevate: css`
    --s1: 0.1rem;
    --s2: calc(var(--s1) * -1);
    box-shadow: inset var(--s1) var(--s1) 0 0 hsl(0, 0%, 100%, 0.25),
      inset var(--s2) var(--s2) 0 0 hsl(0, 0%, 0%, 0.5);
  `,
  depress: css`
    --s1: 0.1rem;
    --s2: calc(var(--s1) * -1);
    box-shadow: inset var(--s1) var(--s1) 0 0 hsl(0, 0%, 0%, 0.5),
      inset var(--s2) var(--s2) 0 0 hsl(0, 0%, 0%, 0.25);
  `,
}
