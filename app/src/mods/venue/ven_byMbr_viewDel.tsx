import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {ven_byMbr_eDef} from "./ven_byMbr_eDef.iso"

export type DeleteVenueByMemberViewProps = {
  onDelete: () => void
}

export const DeleteVenueByMemberView = ({
  onDelete,
}: DeleteVenueByMemberViewProps) => {
  const $deleteVenue = useEdge(ven_byMbr_eDef.deleteCurrent, {
    successMessage: "Venue deleted",
  })

  return (
    <DeleteModal
      noun="Venue"
      loading={$deleteVenue.loading}
      onDelete={() => $deleteVenue.fetch().then(() => onDelete())}
    />
  )
}
