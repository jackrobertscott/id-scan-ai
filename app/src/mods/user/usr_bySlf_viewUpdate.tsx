import {mdiAccountEdit, mdiEmoticonHappy} from "@mdi/js"
import {useState} from "react"
import {Fragment} from "react/jsx-runtime"
import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {Field} from "../../theme/Field"
import {InputString} from "../../theme/InputString"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {usr_bySlf_eDef} from "./usr_bySlf_eDef.iso"
import {UpdateUserFaceBySelfView} from "./usr_bySlf_viewUpdateFace"

export const UpdateUserBySelfView = () => {
  const [showFaceLogin, setShowFaceLogin] = useState(false)

  const $getUser = useEdge(usr_bySlf_eDef.get, {
    fetchOnMount: true,
  })
  const $updateUser = useEdge(usr_bySlf_eDef.update, {
    pushValue: $getUser.output?.user,
    successMessage: "Account updated",
  })

  return (
    <Fragment>
      {showFaceLogin && (
        <UpdateUserFaceBySelfView
          onClose={() => {
            setShowFaceLogin(false)
            $getUser.fetch()
          }}
        />
      )}

      <Spacer>
        <TitleBar title="My Account" />

        <Poster
          icon={mdiAccountEdit}
          title="Update Account"
          desc="We need some more details about you"
        />

        <Field label="First name" variant="required">
          <InputString {...$updateUser.input.getPropsOf("firstName")} />
        </Field>

        <Field label="Last name" variant="required">
          <InputString {...$updateUser.input.getPropsOf("lastName")} />
        </Field>

        <Button
          bgColor="var(--bg-blu)"
          label="Save"
          {...$updateUser.getSubmitProps(() => () => $getUser.fetch())}
        />

        <LoadingScreen
          data={$getUser.output}
          render={({user}) => (
            <Fragment>
              <Divider />

              <Poster
                icon={mdiEmoticonHappy}
                title="Face Login"
                desc="To help streamline the login process, you can enable face login"
              />

              <Button
                bgColor={user.faceAuth ? undefined : "var(--bg-blu)"}
                label={
                  user.faceAuth ? "Update Face Login" : "Enable Face Login"
                }
                onClick={() => setShowFaceLogin(true)}
              />
            </Fragment>
          )}
        />
      </Spacer>
    </Fragment>
  )
}
