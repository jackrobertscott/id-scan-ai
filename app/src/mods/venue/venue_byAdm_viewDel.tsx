import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {venue_byAdm_eDef} from "./venue_byAdm_eDef.iso"

export type DeleteVenueByAdminViewProps = {
  onDelete: () => void
  venueId: string
}

export const DeleteVenueByAdminView = ({
  onDelete,
  venueId,
}: DeleteVenueByAdminViewProps) => {
  const $deleteVenue = useEdge(venue_byAdm_eDef.delete, {
    successMessage: "Venue deleted",
    pushValue: {venueId},
  })

  return (
    <DeleteModal
      noun="Venue"
      loading={$deleteVenue.loading}
      onDelete={() => $deleteVenue.fetch().then(() => onDelete())}
    />
  )
}
