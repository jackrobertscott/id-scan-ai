import {mdiArrowRight, mdiStore} from "@mdi/js"
import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, createPageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {ven_byUsr_eDef} from "./ven_byUsr_eDef.iso"
import {VenueForm} from "./venue_form"

export type CreateVenueByUserViewProps = {
  onClose: (id?: string) => void
}

export const CreateVenueByUserView = ({
  onClose,
}: CreateVenueByUserViewProps) => {
  const $createVenue = useEdge(ven_byUsr_eDef.create, {
    successMessage: "Venue created",
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar title="New Venue" options={createPageOptions(onClose)} />

        <Poster
          icon={mdiStore}
          title="New Venue"
          description="Please tell us about your venue"
        />

        <VenueForm
          value={$createVenue.input.getData()}
          onValue={$createVenue.input.patchData}
        />

        <Button
          label="Submit"
          bgColor="var(--bg-blu)"
          icon={mdiArrowRight}
          {...$createVenue.getSubmitProps((i) => onClose(i.id))}
        />
      </Spacer>
    </Modal>
  )
}
