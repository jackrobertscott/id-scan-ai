import {Fragment} from "react/jsx-runtime"
import {Field} from "../../theme/Field"
import {InputDate} from "../../theme/InputDate"
import {InputSelect} from "../../theme/InputSelect"
import {InputString} from "../../theme/InputString"
import {InputToggle} from "../../theme/InputToggle"
import {useZodForm, ZodFormValue} from "../../utils/useZodForm"
import {
  getScanFilterFormSchema,
  ScanFilterFormSchema,
} from "./scan_storeDef.iso"

export type ScanFilterFormProps = {
  value: ZodFormValue<ScanFilterFormSchema["shape"]>
  onValue: (value: ZodFormValue<ScanFilterFormSchema["shape"]>) => void
  disabled?: boolean
}

export const ScanFilterForm = ({
  value,
  onValue,
  disabled,
}: ScanFilterFormProps) => {
  const form = useZodForm({
    schema: getScanFilterFormSchema(),
    pushValue: value,
    onValue,
    disabled,
  })

  return (
    <Fragment>
      <Field label="Created after">
        <InputDate {...form.getPropsOf("createdAfterDate")} />
      </Field>

      <Field label="Created before">
        <InputDate {...form.getPropsOf("createdBeforeDate")} />
      </Field>

      <Field label="Gender">
        <InputSelect
          {...form.getPropsOf("gender")}
          options={[
            {label: "Male", value: "male"},
            {label: "Female", value: "female"},
          ]}
        />
      </Field>

      <Field label="Post code">
        <InputString {...form.getPropsOf("postCode")} />
      </Field>

      <Field label="Face ID Mismatch">
        <InputToggle {...form.getPropsOf("hasFaceMismatch")} />
      </Field>
    </Fragment>
  )
}
