import {mdiAlertRhombus} from "@mdi/js"
import {FC} from "react"
import {Outlet, useNavigate} from "react-router-dom"
import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {useAuthManager} from "../auth/auth_manager"

export const VenueGate: FC<{redirect: string}> = ({redirect}) => {
  const navigate = useNavigate()
  const authManager = useAuthManager(true)

  if (!authManager.getPayload()?.data.venueId) {
    return (
      <Modal>
        <Spacer>
          <Poster
            icon={mdiAlertRhombus}
            title="Access Denied"
            description="Please join a venue to continue"
            bgColor="var(--bg-red)"
          />
          <Button label="Ok" onClick={() => navigate(redirect)} />
        </Spacer>
      </Modal>
    )
  }

  return <Outlet />
}
