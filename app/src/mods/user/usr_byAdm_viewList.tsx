import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {ListOptions} from "../../theme/ListOptions"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {formatFullName} from "../../utils/formatStrings"
import {useEdge} from "../../utils/server/useEdge"
import {usr_byAdm_eDef} from "./usr_byAdm_eDef.iso"
import {CreateUserByAdminView} from "./usr_byAdm_viewCreate"
import {UpdateUserByAdminView} from "./usr_byAdm_viewUpdate"

export const ListUserByAdminView = () => {
  const $listUsers = useEdge(usr_byAdm_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listUsers.fetch(),
    renderCreate: (onClose) => <CreateUserByAdminView onClose={onClose} />,
    renderRead: (onClose, id) => (
      <UpdateUserByAdminView userId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Users" options={[crud.titleBarOptionCreate]} />

      <ListOptions
        showDates
        data={$listUsers.output?.users}
        total={$listUsers.output?.total}
        value={$listUsers.input.getData()}
        onValue={$listUsers.input.patchData}
        sortKeys={[]}>
        {/* todo */}
      </ListOptions>

      <EmptyListWrap
        label="No Users Yet"
        ready={$listUsers.ready}
        data={$listUsers.output?.users}
        render={(users) => (
          <Field>
            <SimpleList
              options={users.map((user) => ({
                key: user.id,
                label: formatFullName(user) ?? user.email,
                desc: user.createdDate.toLocaleString("en-au", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }),
                onClick: () => crud.onOpenRead(user.id),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
