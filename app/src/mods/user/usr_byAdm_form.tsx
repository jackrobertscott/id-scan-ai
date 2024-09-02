import {Fragment} from "react/jsx-runtime"
import {Field} from "../../theme/Field"
import {InputString} from "../../theme/InputString"
import {useZodForm, ZodFormValue} from "../../utils/useZodForm"
import {
  getUserByAdminFormSchema,
  UserByAdminFormSchema,
} from "./user_storeDef.iso"

export type UserByAdminFormProps = {
  value: ZodFormValue<UserByAdminFormSchema>
  onValue: (value: ZodFormValue<UserByAdminFormSchema>) => void
}

export const UserByAdminForm = ({value, onValue}: UserByAdminFormProps) => {
  const form = useZodForm({
    schema: getUserByAdminFormSchema(),
    pushValue: value,
    onValue,
  })

  return (
    <Fragment>
      <Field label="Email" variant="required">
        <InputString {...form.getPropsOf("email")} />
      </Field>

      <Field label="First Name" variant="required">
        <InputString {...form.getPropsOf("firstName")} />
      </Field>

      <Field label="Last Name" variant="required">
        <InputString {...form.getPropsOf("lastName")} />
      </Field>
    </Fragment>
  )
}
