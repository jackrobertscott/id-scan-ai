import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {member_byMember_eDef} from "./member_byMember_eDef.iso"

export type DeleteMemberByMemberViewProps = {
  onDelete: () => void
  memberId: string
}

export const DeleteMemberByMemberView = ({
  onDelete,
  memberId,
}: DeleteMemberByMemberViewProps) => {
  const $deleteMember = useEdge(member_byMember_eDef.delete, {
    successMessage: "Member deleted",
    pushValue: {memberId},
  })
  return (
    <DeleteModal
      noun="Member"
      loading={$deleteMember.loading}
      onDelete={() => $deleteMember.fetch().then(() => onDelete())}
    />
  )
}
