import {css} from "@emotion/css"
import {FC, MutableRefObject, ReactNode, useEffect, useRef} from "react"
import {useCn} from "../utils/classNames"
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

  const cn = useCn("popup", {
    overlay: css`
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      overflow: auto;
      position: absolute;
      height: 100%;
      width: 100%;
    `,
    container: css`
      position: absolute;
      translate: 0.5rem calc(100% - 0.5rem);
    `,
    content: css`
      margin: -20px;
      padding: 20px;
    `,
  })

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
            className={cn.overlay}
            onClick={({target, currentTarget}) => {
              if (!layerStack.isCurrent()) return
              if (target !== currentTarget) return
              boundingBox.doHide()
              onClickOutside?.()
            }}>
            <div
              ref={popupRef}
              className={cn.container}
              style={{
                top: boundingBox.box.top,
                left: boundingBox.box.left,
                height: boundingBox.box.height,
              }}>
              <div className={cn.content}>{popupContentChildren}</div>
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}

export const PopupContainer: FC<{
  minWidth?: string | null
  maxHeight?: string | null
  bigRadius?: boolean
  children: ReactNode
}> = ({minWidth, maxHeight = "100vh", bigRadius, children}) => {
  const cn = useCn("popup-container", {
    root: css`
      flex-shrink: 0;
      overflow: auto;
      max-height: ${maxHeight};
      min-width: ${minWidth ?? "auto"};
      background-color: var(--bg-color-container);
      border: var(--border-regular);
      border-radius: ${bigRadius
        ? "var(--radius-large)"
        : "var(--radius-regular)"};
      box-shadow: 0 0 1rem 0 hsla(0, 0%, 0%, 0.15);
    `,
    overflow: css`
      overflow: auto;
    `,
  })

  return (
    <div className={cn.root}>
      <div className={cn.overflow}>{children}</div>
    </div>
  )
}
