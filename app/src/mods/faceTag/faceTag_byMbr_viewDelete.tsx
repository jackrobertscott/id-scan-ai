import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {faceTag_byMember_eDef} from "./faceTag_byMember_eDef.iso"

export type DeleteTagByMemberViewProps = {
  onDelete: () => void
  tagId: string
}

export const DeleteTagByMemberView = ({
  onDelete,
  tagId,
}: DeleteTagByMemberViewProps) => {
  const $deleteTag = useEdge(faceTag_byMember_eDef.delete, {
    successMessage: "Tag deleted",
    pushValue: {tagId},
  })
  return (
    <DeleteModal
      noun="Tag"
      loading={$deleteTag.loading}
      onDelete={() => $deleteTag.fetch().then(() => onDelete())}
    />
  )
}
