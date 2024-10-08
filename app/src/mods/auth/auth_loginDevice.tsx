import {mdiDevices} from "@mdi/js"
import {useNavigate} from "react-router-dom"
import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {Field} from "../../theme/Field"
import {InputString} from "../../theme/InputString"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {useEdge} from "../../utils/server/useEdge"
import {useDeviceManager} from "../device/device_manager"
import {auth_eDef} from "./auth_eDef.iso"

export type AuthDeviceByMemberViewProps = {}

export const AuthDeviceByMemberView = ({}: AuthDeviceByMemberViewProps) => {
  const navigate = useNavigate()
  const deviceManager = useDeviceManager()
  const $authDevice = useEdge(auth_eDef.deviceLogin)

  return (
    <Spacer>
      <Poster
        icon={mdiDevices}
        title="Device Login"
        desc="You can find your device key in your venue's device dashboard"
      />

      <Field label="Device Key">
        <InputString {...$authDevice.input.getPropsOf("deviceKey")} />
      </Field>

      {/* <Field label="Passcode">
        <InputString {...$authDevice.input.getPropsOf("passcode")} />
      </Field> */}

      <Button
        bgColor="var(--bg-blu)"
        label="Login"
        {...$authDevice.getSubmitProps((data) => {
          deviceManager.setData(data)
          navigate("/login")
        })}
      />

      <Divider />

      <Button
        label="Login to your account"
        onClick={() => navigate("/login")}
      />

      <Button label="Go to Home Page" onClick={() => navigate("/")} />
    </Spacer>
  )
}
