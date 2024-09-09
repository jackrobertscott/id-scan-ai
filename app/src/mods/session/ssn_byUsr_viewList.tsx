import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {ListOptions} from "../../theme/ListOptions"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {session_byUser_eDef} from "./session_byUser_eDef.iso"
import {ReadSessionByUserView} from "./ssn_byUsr_viewRead"

export const ListSessionByUserView = () => {
  const $listSessions = useEdge(session_byUser_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listSessions.fetch(),
    renderRead: (onClose, id) => (
      <ReadSessionByUserView sessionId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Sessions" options={[crud.titleBarOptionCreate]} />

      <ListOptions
        showDates
        data={$listSessions.output?.sessions}
        total={$listSessions.output?.total}
        value={$listSessions.input.getData()}
        onValue={$listSessions.input.patchData}
        sortKeys={["endedDate", "device", "browser", "os", "engine"]}>
        {/* todo */}
      </ListOptions>

      <EmptyListWrap
        label="No Sessions Yet"
        ready={$listSessions.ready}
        data={$listSessions.output?.sessions}
        render={(sessions) => (
          <Field>
            <SimpleList
              options={sessions.map((session) => ({
                key: session.id,
                label: session.createdDate.toLocaleString("en-au", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }),
                desc: session.userAgent ?? "Unknown agent",
                onClick: () => crud.onOpenRead(session.id),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
