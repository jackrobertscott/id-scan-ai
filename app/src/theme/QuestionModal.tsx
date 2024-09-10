import {mdiBell} from "@mdi/js"
import {Fragment, ReactNode, useState} from "react"
import {Button, ButtonProps} from "./Button"
import {Modal} from "./Modal"
import {Poster, PosterProps} from "./Poster"
import {Spacer} from "./Spacer"

export type QuestionModalProps = {
  render: (doShow: () => void) => ReactNode
  poster?: Partial<PosterProps>
  getButtons: (doHide: () => void) => ButtonProps[]
}

export const QuestionModal = ({
  render,
  poster = {},
  getButtons,
}: QuestionModalProps) => {
  const [show, setShow] = useState(false)
  return (
    <Fragment>
      {render(() => setShow(true))}
      <Modal show={show} size="small">
        <Spacer>
          <Poster
            {...poster}
            icon={poster.icon ?? mdiBell}
            title={poster.title ?? "Please confirm"}
            desc={poster.desc ?? "Are you sure you want to continue?"}
          />
          {...getButtons(() => setShow(false)).map((button) => (
            <Button {...button} />
          ))}
        </Spacer>
      </Modal>
    </Fragment>
  )
}
