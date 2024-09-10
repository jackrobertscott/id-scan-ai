import {mdiLogin} from "@mdi/js"
import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {Field} from "../../theme/Field"
import {InputStatic} from "../../theme/InputStatic"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, updatePageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {device_byMember_eDef} from "./device_byMember_eDef.iso"
import {DeviceByMemberForm} from "./device_byMember_form"
import {DeleteDeviceByMemberView} from "./device_byMember_viewDelete"

export type UpdateDeviceByMemberViewProps = {
  deviceId: string
  onClose: () => void
}

export const UpdateDeviceByMemberView = ({
  deviceId,
  onClose,
}: UpdateDeviceByMemberViewProps) => {
  const $getDevice = useEdge(device_byMember_eDef.get, {
    pushValue: {deviceId},
    fetchOnMount: true,
  })
  const $updateDevice = useEdge(device_byMember_eDef.update, {
    successMessage: "Device updated",
    pushValue: {...$getDevice.output?.device, deviceId},
  })

  return (
    <Modal size="large">
      <Spacer>
        <TitleBar
          title="Device"
          options={updatePageOptions(onClose, $updateDevice.input.hasChanged)}
        />

        <Spacer direction="row" mobileCollapse slim>
          <Spacer slim>
            <LoadingScreen
              data={$getDevice.ready}
              render={() => (
                <DeviceByMemberForm
                  value={$updateDevice.input.getData()}
                  onValue={$updateDevice.input.patchData}
                />
              )}
            />
          </Spacer>
          <Spacer slim>
            <Poster
              icon={mdiLogin}
              title="Device Login"
              desc="Use the following details to login to a device at your venue"
            />

            <Field label="Device Key">
              <InputStatic label={$getDevice.output?.device.deviceKey} />
            </Field>

            {/* <Field label="Passcode">
          <InputStatic label={$getDevice.output?.device.passcode} />
        </Field> */}
          </Spacer>
        </Spacer>
        <Button
          bgColor="var(--bg-blu)"
          label="Save Changes"
          {...$updateDevice.getSubmitProps(() => $getDevice.fetch())}
        />

        <Divider />

        <DeleteDeviceByMemberView
          deviceId={deviceId}
          onDelete={() => onClose()}
        />
      </Spacer>
    </Modal>
  )
}
