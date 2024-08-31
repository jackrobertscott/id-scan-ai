import {css} from "@emotion/css"
import {ReactNode} from "react"
import {createCns} from "../utils/classNames"

export type DisplayImgProps = {
  source?: string
  alt?: string
  width?: string
  aspectRatio?: number
}

export const DisplayImg = ({
  source,
  alt,
  width,
  aspectRatio,
}: DisplayImgProps): ReactNode => {
  return (
    <img
      alt={alt}
      src={source}
      className={cn.displayImage}
      style={{
        width,
        aspectRatio,
        "--max-width": width ?? "100%",
      }}
    />
  )
}

const cn = createCns({
  displayImage: css`
    flex-grow: 1;
    flex-shrink: 0;
    width: 100%;
    max-width: var(--max-width);
    max-height: 100%;
    height: auto;
    object-fit: cover;
    object-position: center;
  `,
})
