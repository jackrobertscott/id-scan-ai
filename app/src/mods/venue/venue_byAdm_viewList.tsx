import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {ListOptions} from "../../theme/ListOptions"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {venue_byAdm_eDef} from "./venue_byAdm_eDef.iso"
import {CreateVenueByAdminView} from "./venue_byAdm_viewCreate"
import {UpdateVenueByAdminView} from "./venue_byAdm_viewUpdate"

export const ListVenueByAdminView = () => {
  const $listVenues = useEdge(venue_byAdm_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listVenues.fetch(),
    renderCreate: (onClose) => <CreateVenueByAdminView onClose={onClose} />,
    renderRead: (onClose, id) => (
      <UpdateVenueByAdminView venueId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Venues" options={[crud.titleBarOptionCreate]} />

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
        label="No Venues Yet"
        ready={$listVenues.ready}
        data={$listVenues.output?.venues}
        render={(venues) => (
          <Field>
            <SimpleList
              options={venues.map((venue) => ({
                key: venue.id,
                label: venue.name,
                description: venue.createdDate.toLocaleString("en-au", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }),
                onClick: () => crud.onOpenRead(venue.id),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
