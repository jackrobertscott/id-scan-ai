import {mdiClose} from "@mdi/js"
import {Fragment} from "react/jsx-runtime"
import {Button} from "../../theme/Button"
import {Field} from "../../theme/Field"
import {InputStatic} from "../../theme/InputStatic"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {QuestionModal} from "../../theme/QuestionModal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {session_byUser_eDef} from "./session_byUser_eDef.iso"

export type ReadSessionByUserViewProps = {
  sessionId: string
  onClose: () => void
}

export const ReadSessionByUserView = ({
  sessionId,
  onClose,
}: ReadSessionByUserViewProps) => {
  const $getEdge = useEdge(session_byUser_eDef.get, {
    pushValue: {sessionId},
    fetchOnMount: true,
  })

  const $deactivateSession = useEdge(session_byUser_eDef.deactivate, {
    successMessage: "Session deactivated",
    pushValue: {sessionId},
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar
          title="Session"
          options={[{icon: mdiClose, label: "Close", onClick: () => onClose()}]}
        />

        <LoadingScreen
          data={$getEdge.output}
          render={({session}) => {
            return (
              <Fragment>
                <Spacer direction="row" slim mobileCollapse>
                  <Spacer direction="column" slim>
                    <Field label="Created date">
                      <InputStatic label={session.createdDate} />
                    </Field>

                    <Field label="Ended date">
                      <InputStatic label={session.endedDate} />
                    </Field>

                    <Field label="Device">
                      <InputStatic label={session.device} />
                    </Field>
                  </Spacer>

                  <Spacer direction="column" slim>
                    <Field label="OS">
                      <InputStatic
                        label={[session.os, session.osVersion].join(" ")}
                      />
                    </Field>

                    <Field label="Browser">
                      <InputStatic
                        label={[session.browser, session.browserVersion].join(
                          " "
                        )}
                      />
                    </Field>

                    <Field label="Engine">
                      <InputStatic
                        label={[session.engine, session.engineVersion].join(
                          " "
                        )}
                      />
                    </Field>
                  </Spacer>
                </Spacer>

                {!session.endedDate && (
                  <QuestionModal
                    poster={{}}
                    render={(doShow) => (
                      <Button
                        label="Deactivate Session"
                        bgColor="var(--bg-red)"
                        onClick={doShow}
                      />
                    )}
                    getButtons={(doClose) => [
                      {
                        ...$deactivateSession.getSubmitProps(() => doClose()),
                        label: "Deactivate",
                        variant: "red",
                      },
                      {
                        label: "Cancel",
                        variant: "grey",
                        onClick: doClose,
                      },
                    ]}
                  />
                )}
              </Fragment>
            )
          }}
        />
      </Spacer>
    </Modal>
  )
}
