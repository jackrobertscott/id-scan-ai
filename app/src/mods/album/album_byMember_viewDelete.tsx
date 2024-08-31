import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {album_byMember_eDef} from "./album_byMember_eDef.iso"

export type DeleteAlbumByMemberViewProps = {
  onDelete: () => void
  albumId: string
}

export const DeleteAlbumByMemberView = ({
  onDelete,
  albumId,
}: DeleteAlbumByMemberViewProps) => {
  const $deleteAlbum = useEdge(album_byMember_eDef.delete, {
    successMessage: "Album deleted",
    pushValue: {albumId},
  })
  return (
    <DeleteModal
      noun="Album"
      loading={$deleteAlbum.loading}
      onDelete={() => $deleteAlbum.fetch().then(() => onDelete())}
    />
  )
}
