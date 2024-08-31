import {css} from "@emotion/css"
import {FC} from "react"
import {useCnStatic} from "../utils/classNames"

export const GridGallery: FC<{
  minRowHeight?: string
  minColumnWidth?: string
  data?: Array<{
    key?: string
    imagePreviewUrls: (string | undefined)[]
    caption?: string
    onClick?: () => void
  }>
}> = ({minRowHeight, minColumnWidth, data}) => {
  minColumnWidth = `${(data?.[0]?.imagePreviewUrls.length ?? 1) * 8}rem`
  minRowHeight = `calc(${minColumnWidth} * (3/4))`

  const cn = useCnStatic("grid-gallery", () => ({
    root: css`
      flex-grow: 1;
      overflow: auto;
    `,
    grid: css`
      display: grid;
      overflow: auto;
      flex-shrink: 0;
      gap: var(--border-regular-width);
      grid-template-columns: repeat(auto-fill, minmax(${minColumnWidth}, 1fr));
    `,
  }))

  return (
    <div className={cn.root}>
      <div className={cn.grid}>
        {data?.map((item, index) => (
          <GalleryItem
            key={item.key ?? index}
            item={item}
            minRowHeight={minRowHeight}
          />
        ))}
      </div>
    </div>
  )
}

const GalleryItem: FC<{
  item: {
    key?: string
    imagePreviewUrls: (string | undefined)[]
    caption?: string
    onClick?: () => void
  }
  minRowHeight: string
}> = ({item, minRowHeight}) => {
  const previewUrls = item.imagePreviewUrls.filter(Boolean)

  const cn = useCnStatic("gallery-item", () => ({
    root: css`
      user-select: none;
      position: relative;
      min-height: ${minRowHeight};
      box-shadow: 0 0 0 var(--border-regular-width) var(--border-regular-color);
    `,
    imageRow: css`
      flex-grow: 1;
      display: grid;
      grid-template-columns: repeat(${previewUrls.length}, 1fr);
    `,
    image: css`
      width: 100%;
      height: 100%;
      object-fit: cover;
    `,
    caption: css`
      gap: 0.5rem;
      padding: 0.25rem;
      background-color: hsl(0, 0%, 0%, 0.5);
      font-size: var(--font-size-small);
      position: absolute;
      text-align: center;
      bottom: 0;
      right: 0;
      left: 0;
    `,
  }))

  return (
    <div key={item.key} onClick={item.onClick} className={cn.root}>
      <div className={cn.imageRow}>
        {previewUrls.map((imageUrl) => (
          <img key={imageUrl} src={imageUrl} className={cn.image} />
        ))}
      </div>
      {item.caption && <div className={cn.caption}>{item.caption}</div>}
    </div>
  )
}
