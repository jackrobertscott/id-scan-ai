import {Fragment} from "react"
import {Field} from "../../theme/Field"
import {InputString} from "../../theme/InputString"
import {InputToggle} from "../../theme/InputToggle"
import {ZodFormValue, useZodForm} from "../../utils/useZodForm"
import {
  DeviceByMemberFormSchema,
  getDeviceByMemberFormSchema,
} from "./device_storeDef.iso"

export type DeviceByMemberFormProps = {
  value: ZodFormValue<DeviceByMemberFormSchema>
  onValue: (value: ZodFormValue<DeviceByMemberFormSchema>) => void
}

export const DeviceByMemberForm = ({
  value,
  onValue,
}: DeviceByMemberFormProps) => {
  const form = useZodForm({
    schema: getDeviceByMemberFormSchema(),
    pushValue: value,
    onValue,
  })

  return (
    <Fragment>
      <Field label="Name" variant="required">
        <InputString {...form.getPropsOf("name")} />
      </Field>

      <Field label="Description" variant="required">
        <InputString {...form.getPropsOf("desc")} />
      </Field>

      <Field
        label="Is Active"
        footNote="A device must be active to allow members from the venue to login">
        <InputToggle {...form.getPropsOf("isActive")} />
      </Field>
    </Fragment>
  )
}
