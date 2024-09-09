import {mdiViewGallery} from "@mdi/js"
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
import {album_byUser_eDef} from "./album_byUser_eDef.iso"

export const ListAlbumByUserView = () => {
  const navigate = useNavigate()
  const $listAlbums = useEdge(album_byUser_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listAlbums.fetch(),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="My Albums" />

      <Poster
        icon={mdiViewGallery}
        title="My Albums"
        desc="Securely shared groups of scans"
      />

      <ListOptions
        showDates
        data={$listAlbums.output?.albums}
        total={$listAlbums.output?.total}
        value={$listAlbums.input.getData()}
        onValue={$listAlbums.input.patchData}
        sortKeys={["label"]}>
        {/* could filter by venue in future */}
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
                desc: album.venue.name,
                onClick: () => navigate(`/album/${album.id.slice(4)}`),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
