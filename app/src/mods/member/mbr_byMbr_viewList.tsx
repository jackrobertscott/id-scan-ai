import {mdiAccountGroup} from "@mdi/js"
import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {InputSelect} from "../../theme/InputSelect"
import {ListOptions} from "../../theme/ListOptions"
import {Poster} from "../../theme/Poster"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {toSentenceCase, toSpacedCase} from "../../utils/changeCase"
import {useEdge} from "../../utils/server/useEdge"
import {CreateMemberByMemberView} from "./mbr_byMbr_viewCreate"
import {UpdateMemberByMemberView} from "./mbr_byMbr_viewUpdate"
import {member_byMember_eDef} from "./member_byMember_eDef.iso"
import {MEMBER_PERMISSIONS_ARRAY} from "./member_storeDef.iso"

export const ListMemberByMemberView = () => {
  const $listMembers = useEdge(member_byMember_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listMembers.fetch(),
    renderCreate: (onClose) => <CreateMemberByMemberView onClose={onClose} />,
    renderRead: (onClose, id) => (
      <UpdateMemberByMemberView memberId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Members" options={[crud.titleBarOptionCreate]} />

      <Poster
        icon={mdiAccountGroup}
        title="Venue Members"
        desc="The people with access to your venue's assets"
      />

      <ListOptions
        showDates
        data={$listMembers.output?.members}
        total={$listMembers.output?.total}
        value={$listMembers.input.getData()}
        onValue={$listMembers.input.patchData}
        sortKeys={["fullAccess"]}>
        <Field label="Full access">
          <InputSelect
            {...$listMembers.input.getPropsOf("fullAccess")}
            options={[
              {label: "Has full access", value: "has"},
              {label: "Does not have full access", value: "hasNot"},
            ]}
          />
        </Field>

        <Field label="Has permission">
          <InputSelect
            {...$listMembers.input.getPropsOf("hasPermission")}
            options={MEMBER_PERMISSIONS_ARRAY.map((permission) => ({
              value: permission,
              label: toSentenceCase(toSpacedCase(permission)),
            }))}
          />
        </Field>
      </ListOptions>

      <EmptyListWrap
        label="No Members Yet"
        ready={$listMembers.ready}
        data={$listMembers.output?.members}
        render={(members) => (
          <Field>
            <SimpleList
              options={members.map((member) => ({
                key: member.id,
                label: member.userFullName,
                desc: member.userEmail,
                onClick: () => crud.onOpenRead(member.id),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
