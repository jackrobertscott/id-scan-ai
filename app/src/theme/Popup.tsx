import {css} from "@emotion/css"
import {FC, MutableRefObject, ReactNode, useEffect, useRef} from "react"
import {createCns} from "../utils/classNames"
import {useBoundingBox} from "../utils/useBoundingBox"
import {useLayerStack} from "../utils/useLayerStack"
import {Portal} from "./Portal"
import {gcn} from "./gcn.css"

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
            className={cn.popup}
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
  return (
    <div
      className={cn.popupContainer}
      style={{
        "--min-width": minWidth,
        "--max-height": maxHeight,
      }}>
      <div className={gcn.overflow_auto}>{children}</div>
    </div>
  )
}

const cn = createCns({
  popup: css`
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
  popupContainer: css`
    overflow: auto;
    flex-shrink: 0;
    max-height: var(--min-height);
    min-width: var(--min-width, auto);
    background-color: var(--bg-color-container);
    box-shadow: 0 0 1rem 0 hsla(0, 0%, 0%, 0.15);
  `,
})
