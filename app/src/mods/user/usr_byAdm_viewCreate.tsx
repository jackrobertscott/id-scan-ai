import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, createPageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {usr_byAdm_eDef} from "./usr_byAdm_eDef.iso"
import {UserByAdminForm} from "./usr_byAdm_form"

export type CreateUserByAdminViewProps = {
  onClose: (id?: string) => void
}

export const CreateUserByAdminView = ({
  onClose,
}: CreateUserByAdminViewProps) => {
  const $createUser = useEdge(usr_byAdm_eDef.create, {
    successMessage: "User created",
  })

  return (
    <Modal size="small">
      <Spacer>
        <TitleBar title="User" options={createPageOptions(onClose)} />

        <UserByAdminForm
          value={$createUser.input.getData()}
          onValue={$createUser.input.patchData}
        />

        <Button
          bgColor="var(--bg-blu)"
          label="Create User"
          {...$createUser.getSubmitProps((i) => onClose(i.id))}
        />
      </Spacer>
    </Modal>
  )
}
