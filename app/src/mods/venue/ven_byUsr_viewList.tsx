import {mdiStore} from "@mdi/js"
import {FC} from "react"
import {useNavigate} from "react-router-dom"
import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {ListOptions} from "../../theme/ListOptions"
import {Poster} from "../../theme/Poster"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {useAlertManager} from "../alert/alert_manager"
import {useAuthManager} from "../auth/auth_manager"
import {ven_byUsr_eDef} from "./ven_byUsr_eDef.iso"
import {CreateVenueByUserView} from "./ven_byUsr_viewCreate"

export const ListVenueByUserView: FC<{}> = () => {
  const navigate = useNavigate()
  const authManager = useAuthManager()
  const alertManager = useAlertManager()
  const $setCurrentVenue = useEdge(ven_byUsr_eDef.setCurrent)
  const $listVenues = useEdge(ven_byUsr_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const handleSelectVenue = async (venueId: string, successMsg?: string) => {
    const data = await $setCurrentVenue.fetch({venueId})
    authManager.setPayload(data.payload)
    if (data.payload.data.venueId) setTimeout(() => navigate("/new-scan"))
    if (successMsg) alertManager.create(successMsg)
  }

  const crud = useCrudState({
    refetch: () => $listVenues.fetch(),
    renderCreate: (onClose) => (
      <CreateVenueByUserView
        onClose={(id) => {
          onClose()
          if (id) handleSelectVenue(id)
        }}
      />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Venues" options={[crud.titleBarOptionCreate]} />

      <Poster
        icon={mdiStore}
        title="Select a Venue"
        desc="Scans are grouped by venue"
      />

      <ListOptions
        showDates
        data={$listVenues.output?.venues}
        total={$listVenues.output?.total}
        value={$listVenues.input.getData()}
        onValue={$listVenues.input.patchData}
        sortKeys={[]}>
        {/* todo */}
      </ListOptions>

      <EmptyListWrap
        label="No Venues Found"
        ready={$listVenues.ready}
        data={$listVenues.output?.venues}
        render={(venues) => (
          <Field>
            <SimpleList
              options={venues.map((venue) => ({
                label: venue.name,
                // desc: venue.address.line1,
                onClick: () => handleSelectVenue(venue.id, "Venue changed"),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
