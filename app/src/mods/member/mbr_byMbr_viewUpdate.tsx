import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, updatePageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {DeleteMemberByMemberView} from "./mbm_byMbr_viewDelete"
import {MemberByMemberForm} from "./mbr_form"
import {member_byMember_eDef} from "./member_byMember_eDef.iso"

export type UpdateMemberByMemberViewProps = {
  memberId: string
  onClose: () => void
}

export const UpdateMemberByMemberView = ({
  memberId,
  onClose,
}: UpdateMemberByMemberViewProps) => {
  const $getMember = useEdge(member_byMember_eDef.get, {
    pushValue: {memberId},
    fetchOnMount: true,
  })
  const $updateMember = useEdge(member_byMember_eDef.update, {
    successMessage: "Member updated",
    pushValue: {...$getMember.output?.member, memberId},
  })

  return (
    <Modal size="small">
      <Spacer>
        <TitleBar
          title="Member"
          options={updatePageOptions(onClose, $updateMember.input.hasChanged)}
        />

        <LoadingScreen
          data={$getMember.ready}
          render={() => (
            <MemberByMemberForm
              value={$updateMember.input.getData()}
              onValue={$updateMember.input.patchData}
            />
          )}
        />

        <Button
          bgColor="var(--bg-blu)"
          label="Save Changes"
          {...$updateMember.getSubmitProps(() => $getMember.fetch())}
        />

        <Divider />

        <DeleteMemberByMemberView
          memberId={memberId}
          onDelete={() => onClose()}
        />
      </Spacer>
    </Modal>
  )
}
