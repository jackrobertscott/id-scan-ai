import {mdiClose} from "@mdi/js"
import {Fragment} from "react/jsx-runtime"
import {Field} from "../../theme/Field"
import {InputStatic} from "../../theme/InputStatic"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {toSentenceCase, toSpacedCase} from "../../utils/changeCase"
import {formatFullName} from "../../utils/formatStrings"
import {useEdge} from "../../utils/server/useEdge"
import {logEvt_byMbr_eDef} from "./logEvt_byMbr_eDef.iso"

export type ReadLoggedEventByMemberViewProps = {
  loggedEventId: string
  onClose: () => void
}

export const ReadLoggedEventByMemberView = ({
  loggedEventId,
  onClose,
}: ReadLoggedEventByMemberViewProps) => {
  const $getEdge = useEdge(logEvt_byMbr_eDef.get, {
    pushValue: {loggedEventId},
    fetchOnMount: true,
  })

  return (
    <Modal size="large">
      <Spacer>
        <TitleBar
          title="Logged Event"
          options={[{icon: mdiClose, label: "Close", onClick: () => onClose()}]}
        />

        <LoadingScreen
          data={$getEdge.output}
          render={({loggedEvent}) => (
            <Spacer direction="row" slim mobileCollapse>
              <Spacer slim direction="column">
                <Field label="Occurred">
                  <InputStatic
                    label={loggedEvent.createdDate.toLocaleString("en-au", {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    })}
                  />
                </Field>
                <Field label="Category">
                  <InputStatic
                    label={toSentenceCase(toSpacedCase(loggedEvent.category))}
                  />
                </Field>
                <Field label="Model">
                  <InputStatic
                    label={toSentenceCase(toSpacedCase(loggedEvent.table))}
                  />
                </Field>
                <Field label="Effected ID">
                  <InputStatic label={loggedEvent.dataId} />
                </Field>
                <Field label="Description">
                  <InputStatic label={loggedEvent.desc ?? "..."} />
                </Field>
              </Spacer>
              <Spacer slim direction="column">
                {loggedEvent.triggeredByUser ? (
                  <Fragment>
                    <Field label="Triggered By">
                      <InputStatic
                        label={formatFullName(loggedEvent.triggeredByUser)}
                      />
                    </Field>
                    <Field label="Triggered By Email">
                      <InputStatic label={loggedEvent.triggeredByUser.email} />
                    </Field>
                  </Fragment>
                ) : (
                  <Field label="Triggered By">
                    <InputStatic label={loggedEvent.triggeredByUserId} />
                  </Field>
                )}
              </Spacer>
            </Spacer>
          )}
        />
      </Spacer>
    </Modal>
  )
}
