import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {ListOptions} from "../../theme/ListOptions"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {toSentenceCase, toSpacedCase} from "../../utils/changeCase"
import {formatFullName} from "../../utils/formatStrings"
import {useEdge} from "../../utils/server/useEdge"
import {SelectUserByMemberView} from "../user/usr_byMbr_viewSelect"
import {logEvt_byMbr_eDef} from "./logEvt_byMbr_eDef.iso"
import {ReadLoggedEventByMemberView} from "./logEvt_byMbr_viewRead"

export const ListLoggedEventByMemberView = () => {
  const $listLoggedEvents = useEdge(logEvt_byMbr_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listLoggedEvents.fetch(),
    renderRead: (onClose, id) => (
      <ReadLoggedEventByMemberView loggedEventId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Logged Events" options={[crud.titleBarOptionCreate]} />

      <ListOptions
        showDates
        data={$listLoggedEvents.output?.loggedEvents}
        total={$listLoggedEvents.output?.total}
        value={$listLoggedEvents.input.getData()}
        onValue={$listLoggedEvents.input.patchData}
        sortKeys={["category"]}>
        <Field label="User">
          <SelectUserByMemberView
            {...$listLoggedEvents.input.getPropsOf("userId")}
          />
        </Field>
      </ListOptions>

      <EmptyListWrap
        label="No Logged Events Yet"
        ready={$listLoggedEvents.ready}
        data={$listLoggedEvents.output?.loggedEvents}
        render={(loggedEvents) => (
          <Field>
            <SimpleList
              options={loggedEvents.map((loggedEvent) => {
                const userName = loggedEvent.triggeredByUser
                  ? formatFullName(loggedEvent.triggeredByUser)
                  : loggedEvent.triggeredByUserId
                let label = [
                  loggedEvent.table,
                  loggedEvent.category,
                  "by",
                  userName,
                ].join(" ")
                label = toSentenceCase(toSpacedCase(label))
                return {
                  key: loggedEvent.id,
                  label: label,
                  description: loggedEvent.createdDate.toLocaleString("en-au", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  }),
                  onClick: () => crud.onOpenRead(loggedEvent.id),
                }
              })}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
