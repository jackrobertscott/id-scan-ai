import {css} from "@emotion/css"
import {ReactNode, useEffect} from "react"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {useCnStatic} from "../utils/classNames"
import {useLayerStack} from "../utils/useLayerStack"
import {Container} from "./Container"
import {Portal} from "./Portal"

export type ModalProps = {
  show?: boolean
  children?: ReactNode
  width?: string
}

export const Modal = ({show = true, children, width}: ModalProps) => {
  const layerStack = useLayerStack()

  useEffect(() => {
    if (show) {
      layerStack.turnOn()
      return () => layerStack.turnOff()
    }
  }, [show])

  const cn = useCnStatic("modal", () => ({
    root: css`
      inset: 0;
      width: 100%;
      height: 100%;
      position: fixed;
      align-items: safe center;
      justify-content: safe center;
      z-index: ${100 + layerStack.getIndex() * 50};
      background-color: hsl(0, 0%, 0%, 0.5);
      padding: 1rem;
      @media (width < ${MEDIA_WIDTH_MOBILE}px) {
        padding: 0;
        align-items: stretch;
        justify-content: end;
      }
    `,
  }))

  if (!show) {
    return null
  }

  return (
    <Portal>
      <div className={cn.root}>
        <Container overlay width={width}>
          {children}
        </Container>
      </div>
    </Portal>
  )
}
