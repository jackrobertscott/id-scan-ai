import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, createPageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {device_byMember_eDef} from "./device_byMember_eDef.iso"
import {DeviceByMemberForm} from "./device_byMember_form"

export type CreateDeviceByMemberViewProps = {
  onClose: (id?: string) => void
}

export const CreateDeviceByMemberView = ({
  onClose,
}: CreateDeviceByMemberViewProps) => {
  const $createDevice = useEdge(device_byMember_eDef.create, {
    successMessage: "Device created",
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar title="Device" options={createPageOptions(onClose)} />

        <DeviceByMemberForm
          value={$createDevice.input.getData()}
          onValue={$createDevice.input.patchData}
        />

        <Button
          bgColor="var(--bg-blu)"
          label="Create Device"
          {...$createDevice.getSubmitProps((data) => onClose(data.id))}
        />
      </Spacer>
    </Modal>
  )
}
