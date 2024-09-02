import {FC} from "react"
import {Button} from "../../theme/Button"
import {Field} from "../../theme/Field"
import {InputString} from "../../theme/InputString"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, createPageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {MemberByMemberForm} from "./mbr_form"
import {member_byMember_eDef} from "./member_byMember_eDef.iso"

export const CreateMemberByMemberView: FC<{
  onClose: (id?: string) => void
}> = ({onClose}) => {
  const $createMember = useEdge(member_byMember_eDef.create, {
    successMessage: "Member created",
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar title="Member" options={createPageOptions(onClose)} />

        <Field label="Email" variant="required">
          <InputString {...$createMember.input.getPropsOf("userEmail")} />
        </Field>

        <MemberByMemberForm
          value={$createMember.input.getData()}
          onValue={$createMember.input.patchData}
        />

        <Button
          // variant="blue"
          label="Create Member"
          {...$createMember.getSubmitProps((i) => onClose(i.id))}
        />
      </Spacer>
    </Modal>
  )
}
