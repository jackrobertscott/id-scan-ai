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
    background-color: var(--lgt-clr);
    box-shadow: inset var(--s1) var(--s1) 0 0 hsl(0, 0%, 100%, 0.25),
      inset var(--s2) var(--s2) 0 0 hsl(0, 0%, 0%, 0.5);
  `,
  depress: css`
    --s1: 0.1rem;
    --s2: calc(var(--s1) * -1);
    background-color: var(--drk-clr);
    box-shadow: inset var(--s1) var(--s1) 0 0 hsl(0, 0%, 0%, 0.5),
      inset var(--s2) var(--s2) 0 0 hsl(0, 0%, 0%, 0.25);
  `,
  greenShdw: css`
    --s1: 0.1rem;
    box-shadow: inset 0 0 0 var(--s1) hsl(120, 100%, 50%, 0.5);
  `,
  divider: css`
    --s1: 0.1rem;
    --s2: calc(var(--s1) * -1);
    height: calc(var(--s1) * 2);
    box-shadow: inset var(--s1) var(--s1) 0 0 hsl(0, 0%, 0%, 0.35),
      inset var(--s2) var(--s2) 0 0 hsl(0, 0%, 100%, 0.15);
  `,
  get hoverClick() {
    return css`
      ${this.elevate}
      position: relative;
      &:hover:not(:active)::before {
        content: "";
        inset: 0;
        position: absolute;
        background-color: hsl(0, 0%, 100%, 0.1);
      }
      &:active {
        ${this.depress}
      }
    `
  },
}
