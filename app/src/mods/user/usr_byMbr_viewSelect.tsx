import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {InputSelectLabel, InputSelectOption} from "../../theme/InputSelect"
import {InputString} from "../../theme/InputString"
import {Popup, PopupContainer} from "../../theme/Popup"
import {Spacer} from "../../theme/Spacer"
import {formatFullName} from "../../utils/formatStrings"
import {useEdge} from "../../utils/server/useEdge"
import {UserType} from "./user_storeDef.iso"
import {usr_byMbr_eDef} from "./usr_byMbr_eDef.iso"

export type SelectUserByMemberViewProps = {
  value?: string | null
  onValue: (id: string | null) => void
}

export const SelectUserByMemberView = ({
  value,
  onValue,
}: SelectUserByMemberViewProps) => {
  const $listUsers = useEdge(usr_byMbr_eDef.select, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {
      selectedUserId: value,
    },
  })

  const formatUserAsLabel = (user: UserType) => {
    return {
      label: [formatFullName(user), user.email].join("\n"),
      value: user.id,
    }
  }

  const selectedUser = $listUsers.output?.selectedUser
  const currentOption =
    value && selectedUser ? formatUserAsLabel(selectedUser) : undefined

  return (
    <Popup
      renderTrigger={(triggerRef, doShow) => (
        <InputSelectLabel<string>
          triggerRef={triggerRef}
          onClick={() => doShow()}
          placeholder="Select User"
          onRemove={() => onValue(null)}
          currentOption={currentOption}
        />
      )}
      renderPopupContent={(doHide) => (
        <PopupContainer minWidth="20rem">
          <Spacer>
            <Field>
              <InputString
                placeholder="Search"
                {...$listUsers.input.getPropsOf("search")}
              />
            </Field>
            <EmptyListWrap
              label="No Users Found"
              ready={$listUsers.ready}
              data={$listUsers.output?.users}
              render={(users) => (
                <Field direction="column">
                  {users.map((user) => (
                    <InputSelectOption
                      key={user.id}
                      option={formatUserAsLabel(user)}
                      currentOption={currentOption}
                      onValue={(id) => onValue(id)}
                      doHide={doHide}
                    />
                  ))}
                </Field>
              )}
            />
          </Spacer>
        </PopupContainer>
      )}
    />
  )
}
