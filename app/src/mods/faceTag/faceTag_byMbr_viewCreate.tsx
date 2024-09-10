import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, createPageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {faceTag_byMember_eDef} from "./faceTag_byMember_eDef.iso"
import {FaceTagForm} from "./faceTag_form"

export type CreateTagByMemberViewProps = {
  scanId: string
  onClose: (id?: string) => void
}

export const CreateTagByMemberView = ({
  scanId,
  onClose,
}: CreateTagByMemberViewProps) => {
  const $createTag = useEdge(faceTag_byMember_eDef.create, {
    successMessage: "Tag created",
    pushValue: {scanId},
  })

  return (
    <Modal size="small">
      <Spacer>
        <TitleBar title="Tag" options={createPageOptions(onClose)} />

        <FaceTagForm
          value={$createTag.input.getData()}
          onValue={$createTag.input.patchData}
        />

        <Button
          bgColor="var(--bg-blu)"
          label="Create Tag"
          {...$createTag.getSubmitProps((i) => onClose(i.id))}
        />
      </Spacer>
    </Modal>
  )
}
