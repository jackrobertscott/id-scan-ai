import {Fragment} from "react/jsx-runtime"
import {brwConf} from "../../brwConf"
import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {Field} from "../../theme/Field"
import {InputStatic} from "../../theme/InputStatic"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, updatePageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {AlbumForm} from "./AlbumForm"
import {DeleteAlbumByMemberView} from "./DeleteAlbumByMemberView"
import {album_byMember_eDef} from "./album_byMember_eDef.iso"
import {AlbumDef} from "./album_storeDef.iso"

export type UpdateAlbumByMemberViewProps = {
  albumId: string
  onClose: () => void
}

export const UpdateAlbumByMemberView = ({
  albumId,
  onClose,
}: UpdateAlbumByMemberViewProps) => {
  const $getAlbum = useEdge(album_byMember_eDef.get, {
    pushValue: {albumId},
    fetchOnMount: true,
  })
  const $updateAlbum = useEdge(album_byMember_eDef.update, {
    successMessage: "Album updated",
    pushValue: {...$getAlbum.output?.album, albumId},
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar
          title="Album"
          options={updatePageOptions(onClose, $updateAlbum.input.hasChanged)}
        />

        <LoadingScreen
          data={$getAlbum.output}
          render={({album}) => (
            <Fragment>
              <Field label="Share Link">
                <InputStatic
                  canCopy
                  label={`${brwConf.VITE_BROWSER_URL}/album/${album.id.replace(
                    AlbumDef.prefix + "_",
                    ""
                  )}`}
                />
              </Field>

              <Divider />

              <AlbumForm
                value={$updateAlbum.input.getData()}
                onValue={$updateAlbum.input.patchData}
              />
            </Fragment>
          )}
        />

        <Button
          // variant="blue"
          label="Save Changes"
          {...$updateAlbum.getSubmitProps(() => $getAlbum.fetch())}
        />

        <Divider />

        <DeleteAlbumByMemberView albumId={albumId} onDelete={() => onClose()} />
      </Spacer>
    </Modal>
  )
}
