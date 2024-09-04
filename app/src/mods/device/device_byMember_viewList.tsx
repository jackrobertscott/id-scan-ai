import {mdiDevices} from "@mdi/js"
import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {InputSelect} from "../../theme/InputSelect"
import {ListOptions} from "../../theme/ListOptions"
import {Poster} from "../../theme/Poster"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {device_byMember_eDef} from "./device_byMember_eDef.iso"
import {CreateDeviceByMemberView} from "./device_byMember_viewCreate"
import {UpdateDeviceByMemberView} from "./device_byMember_viewUpdate"

export const ListDeviceByMemberView = () => {
  const $listDevices = useEdge(device_byMember_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listDevices.fetch(),
    renderCreate: (onClose) => <CreateDeviceByMemberView onClose={onClose} />,
    renderRead: (onClose, id) => (
      <UpdateDeviceByMemberView deviceId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Devices" options={[crud.titleBarOptionCreate]} />

      <Poster
        icon={mdiDevices}
        title="Venue Devices"
        description="Your staff can login to these devices using face ID"
      />

      <ListOptions
        showDates
        data={$listDevices.output?.devices}
        total={$listDevices.output?.total}
        value={$listDevices.input.getData()}
        onValue={$listDevices.input.patchData}
        sortKeys={["name", "isActive"]}>
        <Field label="Status">
          <InputSelect
            {...$listDevices.input.getPropsOf("status")}
            options={[
              {label: "Active Only", value: "active"},
              {label: "Disabled Only", value: "disabled"},
            ]}
          />
        </Field>
      </ListOptions>

      <EmptyListWrap
        label="No Devices Yet"
        ready={$listDevices.ready}
        data={$listDevices.output?.devices}
        render={(devices) => (
          <Field>
            <SimpleList
              options={devices.map((device) => ({
                key: device.id,
                label: device.name,
                desc:
                  device.desc ??
                  device.createdDate.toLocaleString("en-au", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  }),
                onClick: () => crud.onOpenRead(device.id),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
