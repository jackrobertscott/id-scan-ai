import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {ven_byMbr_eDef} from "./ven_byMbr_eDef.iso"
import {DeleteVenueByMemberView} from "./ven_byMbr_viewDel"
import {VenueForm} from "./venue_form"

export type UpdateVenueByMemberViewProps = {
  onClose: () => void
}

export const UpdateVenueByMemberView = ({
  onClose,
}: UpdateVenueByMemberViewProps) => {
  const $getVenue = useEdge(ven_byMbr_eDef.get, {
    fetchOnMount: true,
  })
  const $updateVenue = useEdge(ven_byMbr_eDef.update, {
    successMessage: "Venue updated",
    pushValue: {...$getVenue.output?.venue},
  })

  return (
    <Spacer>
      <TitleBar title="Venue Settings" />

      <LoadingScreen
        data={$getVenue.ready}
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

      <DeleteVenueByMemberView onDelete={() => onClose()} />
    </Spacer>
  )
}
