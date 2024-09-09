import {mdiBell} from "@mdi/js"
import {Fragment, useState} from "react"
import {Button} from "./Button"
import {Modal} from "./Modal"
import {Poster} from "./Poster"
import {Spacer} from "./Spacer"

export type DeleteModalProps = {
  noun?: string
  loading?: boolean
  onDelete?: () => void
  onCancel?: () => void
}

export const DeleteModal = ({
  noun,
  loading,
  onDelete,
  onCancel,
}: DeleteModalProps) => {
  const [show, setShow] = useState(false)

  return (
    <Fragment>
      <Button
        bgColor="var(--bg-red)"
        label={`Delete ${noun}`}
        onClick={() => setShow(true)}
      />
      <Modal show={show} width="15rem">
        <Spacer>
          <Poster
            icon={mdiBell}
            title={`Delete ${noun}`}
            desc={`Are you sure you wish to permanently delete this ${noun}?`}
          />
          <Button
            label="Delete"
            bgColor="var(--bg-red)"
            loading={loading}
            onClick={() => {
              onDelete?.()
              setShow(false)
            }}
          />
          <Button
            label="Cancel"
            onClick={() => {
              if (!loading) setShow(false)
            }}
          />
        </Spacer>
      </Modal>
    </Fragment>
  )
}
