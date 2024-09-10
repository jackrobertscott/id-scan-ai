import {mdiClose} from "@mdi/js"
import {Button} from "../../theme/Button"
import {Field} from "../../theme/Field"
import {InputCamera} from "../../theme/InputCamera"
import {InputString} from "../../theme/InputString"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {usr_bySlf_eDef} from "./usr_bySlf_eDef.iso"

export type UpdateUserFaceBySelfViewProps = {
  onClose: () => void
}

export const UpdateUserFaceBySelfView = ({
  onClose,
}: UpdateUserFaceBySelfViewProps) => {
  const $updateFace = useEdge(usr_bySlf_eDef.updateFace, {
    successMessage: "Face login now enabled",
  })

  return (
    <Modal size="small">
      <Spacer>
        <TitleBar
          title="Face Login"
          options={[{icon: mdiClose, label: "Close", onClick: onClose}]}
        />

        <Field label="Your face">
          <InputCamera {...$updateFace.input.getPropsOf("photoFile")} />
        </Field>

        <Field
          label="Passcode"
          footNote="A short 6 digit number code to enter when you use face login">
          <InputString
            maxLength={6}
            placeholder="000000"
            {...$updateFace.input.getPropsOf("passcode")}
          />
        </Field>

        <Button
          label="Save"
          bgColor="var(--bg-blu)"
          {...$updateFace.getSubmitProps(() => onClose())}
        />
      </Spacer>
    </Modal>
  )
}
