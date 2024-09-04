import {css} from "@emotion/css"
import {ReactNode} from "react"
import {prettyCns} from "../utils/classNames"

export type DisplayImageProps = {
  source?: string
  alt?: string
  width?: string
  aspectRatio?: number
}

export const DisplayImage = ({
  source,
  alt,
  width,
  aspectRatio,
}: DisplayImageProps): ReactNode => {
  return (
    <img
      src={source}
      alt={alt}
      style={{
        width,
        aspectRatio,
        "--max-width": width ?? "100%",
      }}
      className={cn_di.root}
    />
  )
}

const cn_di = prettyCns("DisplayImage", {
  root: css`
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
