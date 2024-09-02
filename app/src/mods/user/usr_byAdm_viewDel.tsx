import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {usr_byAdm_eDef} from "./usr_byAdm_eDef.iso"

export type DeleteUserByAdminViewProps = {
  onDelete: () => void
  userId: string
}

export const DeleteUserByAdminView = ({
  onDelete,
  userId,
}: DeleteUserByAdminViewProps) => {
  const $deleteUser = useEdge(usr_byAdm_eDef.delete, {
    successMessage: "User deleted",
    pushValue: {userId},
  })
  return (
    <DeleteModal
      noun="User"
      loading={$deleteUser.loading}
      onDelete={() => $deleteUser.fetch().then(() => onDelete())}
    />
  )
}
