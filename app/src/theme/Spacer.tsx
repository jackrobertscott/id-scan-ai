import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {gcn} from "../gcn"
import {jn_cn, prettyCns} from "../utils/classNames"

export const Spacer: FC<{
  grow?: boolean
  noBasis?: boolean
  children?: ReactNode
  direction?: "row" | "column"
  className?: string
  slim?: boolean
  mobileCollapse?: boolean
}> = ({
  grow,
  noBasis,
  children,
  direction,
  className,
  slim,
  mobileCollapse,
}) => {
  return (
    <div
      data-slim={slim}
      data-direction={direction}
      data-collapse={mobileCollapse}
      data-nobasis={noBasis}
      className={jn_cn(cn_s.root, className, grow && gcn.grow)}>
      {children}
    </div>
  )
}

const cn_s = prettyCns("Spacer", {
  root: css`
    gap: 1rem;
    flex-shrink: 0;
    overflow: auto;
    flex-direction: "column";
    &[data-nobasis="true"] {
      flex-basis: 0;
    }
    &[data-direction="row"] {
      flex-direction: row;
    }
    &:not([data-slim="true"]) {
      padding: 1rem;
    }
    @media (width < ${MEDIA_WIDTH_MOBILE}px) {
      &[data-collapse="true"][data-direction="row"] {
        flex-direction: column;
      }
    }
    @media (width >= ${MEDIA_WIDTH_MOBILE}px) {
      &[data-collapse="true"] {
        & > * {
          flex-basis: 0;
        }
        &[data-direction="row"] > * {
          flex-grow: 1;
        }
      }
    }
  `,
})
