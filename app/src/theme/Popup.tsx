import {css} from "@emotion/css"
import {FC, MutableRefObject, ReactNode, useEffect, useRef} from "react"
import {prettyCns} from "../utils/classNames"
import {useBoundingBox} from "../utils/useBoundingBox"
import {useLayerStack} from "../utils/useLayerStack"
import {Portal} from "./Portal"

export const Popup: FC<{
  renderTrigger: (
    triggerRef: MutableRefObject<any>,
    doShow: () => void,
    isOpen: boolean
  ) => ReactNode
  renderPopupContent: (doHide: () => void) => ReactNode
  hidePopup?: boolean
  onClickOutside?: () => void
}> = ({renderTrigger, renderPopupContent, hidePopup, onClickOutside}) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const boundingBox = useBoundingBox<HTMLInputElement>()
  const layerStack = useLayerStack()
  const popupContentChildren = renderPopupContent(() => boundingBox.doHide())

  useEffect(() => {
    if (boundingBox.box) {
      layerStack.turnOn()
    } else {
      layerStack.turnOff()
    }
  }, [boundingBox.box])

  return (
    <>
      {renderTrigger(
        boundingBox.triggerRef,
        () => boundingBox.doShow(),
        !!boundingBox.box
      )}
      {!hidePopup && boundingBox.box && (
        <Portal>
          <div
            className={cn_p.overlay}
            onClick={({target, currentTarget}) => {
              if (!layerStack.isCurrent()) return
              if (target !== currentTarget) return
              boundingBox.doHide()
              onClickOutside?.()
            }}>
            <div
              ref={popupRef}
              className={cn_p.container}
              style={{
                top: boundingBox.box.top,
                left: boundingBox.box.left,
                height: boundingBox.box.height,
              }}>
              <div className={cn_p.content}>{popupContentChildren}</div>
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}

const cn_p = prettyCns("Popup", {
  overlay: css`
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    overflow: auto;
    position: absolute;
    background-color: hsla(0, 0%, 0%, 0.5);
    height: 100%;
    width: 100%;
  `,
  container: css`
    position: absolute;
    translate: 0 calc(100%);
  `,
  content: css`
    margin: -1rem;
    padding: 1rem;
  `,
})

export const PopupContainer: FC<{
  minWidth?: string | null
  maxHeight?: string | null
  children: ReactNode
}> = ({minWidth, maxHeight = "100vh", children}) => {
  return (
    <div
      className={cn_pc.root}
      style={{
        "--min-width": minWidth,
        "--max-height": maxHeight,
      }}>
      <div className={cn_pc.overflow}>{children}</div>
    </div>
  )
}

const cn_pc = prettyCns("PopupContainer", {
  root: css`
    overflow: auto;
    flex-shrink: 0;
    min-width: var(--min-width, auto);
    min-height: var(--min-height);
    background-color: var(--bg-clr);
    box-shadow: 0 0 1rem 0 hsla(0, 0%, 0%, 0.15);
  `,
  overflow: css`
    overflow: auto;
  `,
})
