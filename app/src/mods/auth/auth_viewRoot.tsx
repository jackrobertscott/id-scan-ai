import {mdiCheckCircleOutline} from "@mdi/js"
import {Navigate, useNavigate} from "react-router-dom"
import {Button} from "../../theme/Button"
import {ComingSoon} from "../../theme/ComingSoon"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {useDeviceManager} from "../device/device_manager"
import {useAuthManager} from "./auth_manager"

export type AuthLoginRootProps = {}

export const AuthLoginRoot = ({}: AuthLoginRootProps) => {
  const navigate = useNavigate()
  const authManager = useAuthManager()
  const deviceManager = useDeviceManager()

  if (authManager.isAuthed()) {
    return <Navigate to="/my-account" />
  }

  if (!deviceManager.data) {
    return <Navigate to="/login-email"></Navigate>
  }

  return (
    <Spacer>
      <Poster
        icon={mdiCheckCircleOutline}
        title={deviceManager.data.payload.name}
        desc="Venue staff who have enabled face ID login on their account may now login"
      />

      <Button
        bgColor="var(--bg-blu)"
        label="Login with Face ID"
        onClick={() => navigate("/login-face")}
      />

      <ComingSoon
        render={(doShow) => (
          <Button label="Logout of device" onClick={doShow} />
        )}
      />
    </Spacer>
  )
}
