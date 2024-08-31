import {BaseSyntheticEvent, Fragment, ReactNode, useState} from "react"
import {listCreateOption} from "./TitleBar"

export type CrudStateHookProps = {
  refetch: () => void
  renderCreate?: (onClose: () => void) => ReactNode
  renderRead?: (onClose: () => void, id: string) => ReactNode
}

export const useCrudState = (options: CrudStateHookProps) => {
  const [showId, setShowId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const onOpenRead = (id: string) => setShowId(id)
  const onOpenCreate = () => setShowCreate(true)
  const onCloseRead = () => {
    options.refetch()
    setShowId(null)
  }
  const onCloseCreate = (id?: string | BaseSyntheticEvent) => {
    options.refetch()
    setShowCreate(false)
    if (typeof id === "string") setShowId(id)
  }

  return {
    showId,
    showCreate,
    titleBarOptionCreate: listCreateOption(() => setShowCreate(true)),
    onOpenRead,
    onOpenCreate,
    onCloseRead,
    onCloseCreate,
    render: (children: ReactNode) => {
      return (
        <Fragment>
          {showCreate && options.renderCreate?.(onCloseCreate)}
          {showId && options.renderRead?.(onCloseRead, showId)}
          {children}
        </Fragment>
      )
    },
  }
}
