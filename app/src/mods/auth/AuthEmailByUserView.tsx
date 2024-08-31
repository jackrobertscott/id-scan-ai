import {mdiAccountLock, mdiEmailFast, mdiOpenInNew} from "@mdi/js"
import {FC, useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {Field} from "../../theme/Field"
import {InputString} from "../../theme/InputString"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {useEdge} from "../../utils/server/useEdge"
import {auth_email_eDef} from "./auth_email_eDef.iso"
import {useAuthManager} from "./auth_manager"

export const AuthEmailByUserView: FC<{}> = () => {
  const navigate = useNavigate()
  const authManager = useAuthManager()
  const [email, setEmail] = useState<null | string>(null)

  const $sendCode = useEdge(auth_email_eDef.sendAuthCode)
  const $verifyCode = useEdge(auth_email_eDef.verifyAuthCode, {
    pushValue: {
      email,
      userAgent: navigator.userAgent,
    },
  })

  // Step 1: Enter email
  if (!email) {
    return (
      <Spacer>
        <Poster
          icon={mdiAccountLock}
          title="Account Login"
          description="Please enter your email address to login"
        />

        <Field label="Email" variant="required">
          <InputString {...$sendCode.input.getPropsOf("email")} />
        </Field>

        <Button
          // variant="blue"
          label="Sign into account"
          {...$sendCode.getSubmitProps((data) => setEmail(data.email))}
        />

        <Divider />

        <Button
          // variant="grey"
          label="Login to a device"
          icon={mdiOpenInNew}
          onClick={() => navigate("/login-device")}
        />

        <Button
          // variant="clear"
          label="Go to Home Page"
          onClick={() => navigate("/")}
        />
      </Spacer>
    )
  }

  // Step 2: Enter code
  return (
    <Spacer>
      <Poster
        icon={mdiEmailFast}
        title="Check Your Email"
        description="We have sent you a login code"
      />

      <Field label="Email" variant="locked">
        <InputString disabled {...$verifyCode.input.getPropsOf("email")} />
      </Field>

      <Field label="Code" variant="required">
        <InputString
          {...$verifyCode.input.getPropsOf("authCode")}
          placeholder="000000"
          maxLength={6}
        />
      </Field>

      <Button
        label="Submit"
        // variant="blue"
        {...$verifyCode.getSubmitProps((data) => {
          authManager.setPayload(data.payload)
          navigate(
            data.payload.data.venueId ? "/scan-history" : "/select-venue"
          )
        })}
      />

      <Divider />

      <Button
        label="Cancel"
        // variant="clear"
        onClick={() => setEmail(null)}
      />
    </Spacer>
  )
}
