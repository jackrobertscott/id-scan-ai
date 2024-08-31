import {mdiHeadQuestion} from "@mdi/js"
import {useNavigate} from "react-router-dom"
import {Button} from "../../theme/Button"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {useAuthManager} from "../auth/auth_manager"

export type Page404Props = {}

export const Page404 = ({}: Page404Props) => {
  const navigate = useNavigate()
  const authManager = useAuthManager()
  return (
    <Spacer>
      <Poster icon={mdiHeadQuestion} title="404" description="Page not found" />
      <Button label="Home" onClick={() => navigate("/")} />
      {authManager.getPayload()?.token ? (
        <Button label="Dashboard" onClick={() => navigate("/my-account")} />
      ) : (
        <Button label="Login" onClick={() => navigate("/login")} />
      )}
    </Spacer>
  )
}
