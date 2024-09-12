import {mdiClose} from "@mdi/js"
import {Navigate, useNavigate} from "react-router-dom"
import {Button} from "../../theme/Button"
import {Field} from "../../theme/Field"
import {InputCamera} from "../../theme/InputCamera"
import {InputString} from "../../theme/InputString"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {useDeviceManager} from "../device/device_manager"
import {auth_eDef} from "./auth_eDef.iso"
import {useAuthManager} from "./auth_manager"

export type AuthFaceByUserViewProps = {}

export const AuthFaceByUserView = ({}: AuthFaceByUserViewProps) => {
  const navigate = useNavigate()
  const authManager = useAuthManager()
  const deviceManager = useDeviceManager()
  const $loginFace = useEdge(auth_eDef.deviceFaceLogin, {
    pushValue: {
      deviceToken: deviceManager.data?.token,
      userAgent: navigator.userAgent,
    },
  })

  if (!deviceManager.data) {
    return <Navigate to="/login" />
  }

  return (
    <Spacer>
      <TitleBar
        title="Login with Face"
        options={[
          {icon: mdiClose, label: "Cancel", onClick: () => navigate("/login")},
        ]}
      />

      <Field label="Your face" variant="required" noBasis>
        <InputCamera {...$loginFace.input.getPropsOf("photoFile")} />
      </Field>

      <Field label="Passcode" variant="required">
        <InputString
          maxLength={6}
          {...$loginFace.input.getPropsOf("passcode")}
        />
      </Field>

      <Button
        label="Login"
        bgColor="var(--bg-blu)"
        {...$loginFace.getSubmitProps((data) => {
          authManager.setPayload(data.payload)
          navigate("/new-scan")
        })}
      />
    </Spacer>
  )
}
