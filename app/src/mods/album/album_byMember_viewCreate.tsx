import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {createPageOptions, TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {album_byMember_eDef} from "./album_byMember_eDef.iso"
import {AlbumForm} from "./album_form"

export type CreateAlbumByMemberViewProps = {
  onClose: (id?: string) => void
}

export const CreateAlbumByMemberView = ({
  onClose,
}: CreateAlbumByMemberViewProps) => {
  const $createAlbum = useEdge(album_byMember_eDef.create, {
    successMessage: "Album created",
    pushValue: {filters: {}},
  })

  return (
    <Modal size="large">
      <Spacer>
        <TitleBar title="Album" options={createPageOptions(onClose)} />

        <AlbumForm
          value={$createAlbum.input.getData()}
          onValue={$createAlbum.input.patchData}
        />

        <Button
          label="Create Album"
          bgColor="var(--bg-blu)"
          {...$createAlbum.getSubmitProps((data) => onClose(data.id))}
        />
      </Spacer>
    </Modal>
  )
}
