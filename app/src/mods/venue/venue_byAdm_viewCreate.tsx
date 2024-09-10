import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, createPageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {venue_byAdm_eDef} from "./venue_byAdm_eDef.iso"
import {VenueForm} from "./venue_form"

export type CreateVenueByAdminViewProps = {
  onClose: (id?: string) => void
}

export const CreateVenueByAdminView = ({
  onClose,
}: CreateVenueByAdminViewProps) => {
  const $createVenue = useEdge(venue_byAdm_eDef.create, {
    successMessage: "Venue created",
  })

  return (
    <Modal size="small">
      <Spacer>
        <TitleBar title="Venue" options={createPageOptions(onClose)} />

        <VenueForm
          value={$createVenue.input.getData()}
          onValue={$createVenue.input.patchData}
        />

        <Button
          bgColor="var(--bg-blu)"
          label="Create Venue"
          {...$createVenue.getSubmitProps((i) => onClose(i.id))}
        />
      </Spacer>
    </Modal>
  )
}
