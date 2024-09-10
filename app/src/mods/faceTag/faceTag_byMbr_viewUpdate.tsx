import {mdiHistory} from "@mdi/js"
import {Fragment, useState} from "react"
import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, updatePageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {ListSimilarPatronByMemberView} from "../livePhoto/livePhoto_byMbr_viewListSimilar"
import {DeleteTagByMemberView} from "./faceTag_byMbr_viewDelete"
import {faceTag_byMember_eDef} from "./faceTag_byMember_eDef.iso"
import {FaceTagForm} from "./faceTag_form"

export type UpdateTagByMemberViewProps = {
  tagId: string
  onClose: () => void
}

export const UpdateTagByMemberView = ({
  tagId,
  onClose,
}: UpdateTagByMemberViewProps) => {
  const [liveFaceSearchId, setLiveFaceSearchId] = useState<string | null>()
  const $getTag = useEdge(faceTag_byMember_eDef.get, {
    pushValue: {tagId},
    fetchOnMount: true,
  })
  const $updateTag = useEdge(faceTag_byMember_eDef.update, {
    successMessage: "Tag updated",
    pushValue: {...$getTag.output?.tag, tagId},
  })

  return (
    <Fragment>
      {liveFaceSearchId && (
        <Modal size="large">
          <ListSimilarPatronByMemberView
            livePhotoId={liveFaceSearchId}
            onClose={() => setLiveFaceSearchId(null)}
          />
        </Modal>
      )}

      <Modal size="small">
        <Spacer>
          <TitleBar
            title="Tag"
            options={updatePageOptions(onClose, $updateTag.input.hasChanged)}
          />

          <LoadingScreen
            data={$updateTag.ready}
            render={() => (
              <Fragment>
                <FaceTagForm
                  value={$updateTag.input.getData()}
                  onValue={$updateTag.input.patchData}
                />
              </Fragment>
            )}
          />

          <Button
            bgColor="var(--bg-blu)"
            label="Save Changes"
            {...$updateTag.getSubmitProps(() => $getTag.fetch())}
          />

          <Divider />

          {$getTag.output?.tag.livePhotoId && (
            <Button
              bgColor="var(--bg-blu)"
              label="View patron's history"
              icon={mdiHistory}
              onClick={() =>
                setLiveFaceSearchId($getTag.output?.tag.livePhotoId)
              }
            />
          )}

          <DeleteTagByMemberView tagId={tagId} onDelete={() => onClose()} />
        </Spacer>
      </Modal>
    </Fragment>
  )
}
