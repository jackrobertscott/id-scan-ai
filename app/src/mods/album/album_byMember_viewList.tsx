import {mdiShare} from "@mdi/js"
import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {InputSelect} from "../../theme/InputSelect"
import {ListOptions} from "../../theme/ListOptions"
import {Poster} from "../../theme/Poster"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {album_byMember_eDef} from "./album_byMember_eDef.iso"
import {CreateAlbumByMemberView} from "./album_byMember_viewCreate"
import {UpdateAlbumByMemberView} from "./album_byMember_viewUpdate"

export const ListAlbumByMemberView = () => {
  const $listAlbums = useEdge(album_byMember_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listAlbums.fetch(),
    renderCreate: (onClose) => <CreateAlbumByMemberView onClose={onClose} />,
    renderRead: (onClose, id) => (
      <UpdateAlbumByMemberView albumId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Albums" options={[crud.titleBarOptionCreate]} />

      <Poster
        icon={mdiShare}
        title="Shared Albums"
        desc="Securely share a filtered set of scans with external parties"
      />

      <ListOptions
        showDates
        data={$listAlbums.output?.albums}
        total={$listAlbums.output?.total}
        value={$listAlbums.input.getData()}
        onValue={$listAlbums.input.patchData}
        sortKeys={["label", "isActive"]}>
        <Field label="Status">
          <InputSelect
            {...$listAlbums.input.getPropsOf("status")}
            options={[
              {label: "Active Only", value: "active"},
              {label: "Disabled Only", value: "disabled"},
            ]}
          />
        </Field>
      </ListOptions>

      <EmptyListWrap
        label="No Albums Yet"
        ready={$listAlbums.ready}
        data={$listAlbums.output?.albums}
        render={(albums) => (
          <Field>
            <SimpleList
              options={albums.map((album) => ({
                key: album.id,
                label: album.name,
                desc: album.createdDate.toLocaleString("en-au", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }),
                onClick: () => crud.onOpenRead(album.id),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
