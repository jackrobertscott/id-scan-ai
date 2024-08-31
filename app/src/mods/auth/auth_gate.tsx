import {mdiAlertRhombus} from "@mdi/js"
import {FC} from "react"
import {Outlet, useNavigate} from "react-router-dom"
import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {useAuthManager} from "./auth_manager"

export const AuthGate: FC<{redirect: string}> = ({redirect}) => {
  const navigate = useNavigate()
  const authManager = useAuthManager()

  // If the user is not logged in, show the login form
  if (!authManager.getPayload()) {
    return (
      <Modal>
        <Spacer>
          <Poster
            icon={mdiAlertRhombus}
            title="Access Denied"
            description="Please login to access this page"
            // variant="red"
          />
          <Button
            label="Ok"
            // variant="grey"
            onClick={() => navigate(redirect)}
          />
        </Spacer>
      </Modal>
    )
  }

  // If the user is logged in, show the children
  return <Outlet />
}
