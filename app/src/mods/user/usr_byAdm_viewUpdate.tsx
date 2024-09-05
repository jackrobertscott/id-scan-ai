import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, updatePageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {usr_byAdm_eDef} from "./usr_byAdm_eDef.iso"
import {UserByAdminForm} from "./usr_byAdm_form"
import {DeleteUserByAdminView} from "./usr_byAdm_viewDel"

export type UpdateUserByAdminViewProps = {
  userId: string
  onClose: () => void
}

export const UpdateUserByAdminView = ({
  userId,
  onClose,
}: UpdateUserByAdminViewProps) => {
  const $getUser = useEdge(usr_byAdm_eDef.get, {
    pushValue: {userId},
    fetchOnMount: true,
  })
  const $updateUser = useEdge(usr_byAdm_eDef.update, {
    successMessage: "User updated",
    pushValue: {...$getUser.output?.user, userId},
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar
          title="User"
          options={updatePageOptions(onClose, $updateUser.input.hasChanged)}
        />

        <LoadingScreen
          data={$updateUser.ready}
          render={() => (
            <UserByAdminForm
              value={$updateUser.input.getData()}
              onValue={$updateUser.input.patchData}
            />
          )}
        />

        <Button
          bgColor="var(--bg-blu)"
          label="Save Changes"
          {...$updateUser.getSubmitProps(() => $getUser.fetch())}
        />

        <Divider />

        <DeleteUserByAdminView userId={userId} onDelete={() => onClose()} />
      </Spacer>
    </Modal>
  )
}
