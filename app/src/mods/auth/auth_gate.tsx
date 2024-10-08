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
      <Modal size="small">
        <Spacer>
          <Poster
            icon={mdiAlertRhombus}
            title="Access Denied"
            desc="Please login to access this page"
          />
          <Button label="Ok" onClick={() => navigate(redirect)} />
        </Spacer>
      </Modal>
    )
  }

  // If the user is logged in, show the children
  return <Outlet />
}

export const AdminGate: FC<{
  redirect: string
}> = ({redirect}) => {
  const navigate = useNavigate()
  const authManager = useAuthManager(true)

  if (!authManager.getPayload()?.data.isAdmin) {
    return (
      <Modal size="small">
        <Spacer>
          <Poster
            icon={mdiAlertRhombus}
            title="Access Denied"
            desc="You must be an admin to access this page"
          />
          <Button label="Ok" onClick={() => navigate(redirect)} />
        </Spacer>
      </Modal>
    )
  }

  return <Outlet />
}
