import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {device_byMember_eDef} from "./device_byMember_eDef.iso"

export type DeleteDeviceByMemberViewProps = {
  onDelete: () => void
  deviceId: string
}

export const DeleteDeviceByMemberView = ({
  onDelete,
  deviceId,
}: DeleteDeviceByMemberViewProps) => {
  const $deleteDevice = useEdge(device_byMember_eDef.delete, {
    successMessage: "Device deleted",
    pushValue: {deviceId},
  })
  return (
    <DeleteModal
      noun="Device"
      loading={$deleteDevice.loading}
      onDelete={() => $deleteDevice.fetch().then(() => onDelete())}
    />
  )
}
