import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, updatePageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {venue_byAdm_eDef} from "./venue_byAdm_eDef.iso"
import {DeleteVenueByAdminView} from "./venue_byAdm_viewDel"
import {VenueForm} from "./venue_form"

export type UpdateVenueByAdminViewProps = {
  venueId: string
  onClose: () => void
}

export const UpdateVenueByAdminView = ({
  venueId,
  onClose,
}: UpdateVenueByAdminViewProps) => {
  const $getVenue = useEdge(venue_byAdm_eDef.get, {
    pushValue: {venueId},
    fetchOnMount: true,
  })
  const $updateVenue = useEdge(venue_byAdm_eDef.update, {
    successMessage: "Venue updated",
    pushValue: {...$getVenue.output?.venue, venueId},
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar
          title="Venue"
          options={updatePageOptions(onClose, $updateVenue.input.hasChanged)}
        />

        <LoadingScreen
          data={$updateVenue.ready}
          render={() => (
            <VenueForm
              value={$updateVenue.input.getData()}
              onValue={$updateVenue.input.patchData}
            />
          )}
        />

        <Button
          bgColor="var(--bg-blu)"
          label="Save Changes"
          {...$updateVenue.getSubmitProps(() => $getVenue.fetch())}
        />

        <Divider />

        <DeleteVenueByAdminView venueId={venueId} onDelete={() => onClose()} />
      </Spacer>
    </Modal>
  )
}
