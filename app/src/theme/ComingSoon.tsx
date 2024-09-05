import {mdiBell} from "@mdi/js"
import {Fragment, ReactNode, useState} from "react"
import {Button} from "./Button"
import {Modal} from "./Modal"
import {Poster} from "./Poster"
import {Spacer} from "./Spacer"

export type ComingSoonProps = {
  render: (doShow: () => void) => ReactNode
}

export const ComingSoon = ({render}: ComingSoonProps) => {
  const [show, setShow] = useState(false)
  return (
    <Fragment>
      {render(() => setShow(true))}
      <Modal show={show} width="15rem">
        <Spacer>
          <Poster
            icon={mdiBell}
            title="Coming Soon"
            description="This feature is not yet available"
          />
          <Button label="Ok" onClick={() => setShow(false)} />
        </Spacer>
      </Modal>
    </Fragment>
  )
}
