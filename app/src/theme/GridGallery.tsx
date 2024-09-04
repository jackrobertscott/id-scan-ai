import {css} from "@emotion/css"
import {FC} from "react"
import {prettyCns} from "../utils/classNames"

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

  return (
    <div className={cn_gg.root}>
      <div className={cn_gg.grid} style={{"--min-width": minColumnWidth}}>
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

const cn_gg = prettyCns("GridGallery", {
  root: css`
    flex-grow: 1;
    overflow: auto;
  `,
  grid: css`
    gap: 1rem;
    display: grid;
    overflow: auto;
    flex-shrink: 0;
    grid-template-columns: repeat(auto-fill, minmax(var(--min-width), 1fr));
  `,
})

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

  return (
    <div
      key={item.key}
      onClick={item.onClick}
      className={cn_gi.root}
      style={{"--min-height": minRowHeight}}>
      <div
        className={cn_gi.imageRow}
        style={{"--num-images": previewUrls.length}}>
        {previewUrls.map((imageUrl) => (
          <img key={imageUrl} src={imageUrl} className={cn_gi.image} />
        ))}
      </div>
      {item.caption && <div className={cn_gi.caption}>{item.caption}</div>}
    </div>
  )
}

const cn_gi = prettyCns("gallery-item", {
  root: css`
    user-select: none;
    position: relative;
    min-height: var(--min-height);
  `,
  imageRow: css`
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(var(--num-images), 1fr);
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
})
