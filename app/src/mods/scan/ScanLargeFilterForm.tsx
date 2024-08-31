import {Fragment} from "react/jsx-runtime"
import {Field} from "../../theme/Field"
import {InputDate} from "../../theme/InputDate"
import {InputSelect} from "../../theme/InputSelect"
import {InputString} from "../../theme/InputString"
import {InputToggle} from "../../theme/InputToggle"
import {toSentenceCase} from "../../utils/changeCase"
import {faceEmotionOptions} from "../../utils/faceMetaSchema"
import {useZodForm, ZodFormValue} from "../../utils/useZodForm"
import {
  getScanLargeFilterFormSchema,
  ScanLargeFilterFormSchema,
} from "./scan_storeDef.iso"

export type ScanLargeFilterFormProps = {
  value: ZodFormValue<ScanLargeFilterFormSchema["shape"]>
  onValue: (value: ZodFormValue<ScanLargeFilterFormSchema["shape"]>) => void
  disabled?: boolean
}

export const ScanLargeFilterForm = ({
  value,
  onValue,
  disabled,
}: ScanLargeFilterFormProps) => {
  const form = useZodForm({
    schema: getScanLargeFilterFormSchema(),
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

      <Field label="Face ID Mismatch">
        <InputToggle {...form.getPropsOf("hasFaceMismatch")} />
      </Field>

      <Field label="Post code">
        <InputString {...form.getPropsOf("postCode")} />
      </Field>

      <Field label="Primary emotion">
        <InputSelect
          {...form.getPropsOf("primaryEmotion")}
          options={faceEmotionOptions.map((i) => ({
            label: toSentenceCase(i),
            value: i.toUpperCase(),
          }))}
        />
      </Field>

      <Field label="Born after">
        <InputDate {...form.getPropsOf("bornAfterDate")} />
      </Field>

      <Field label="Born before">
        <InputDate {...form.getPropsOf("bornAfterDate")} />
      </Field>

      <Field label="Glasses">
        <InputToggle {...form.getPropsOf("hasGlasses")} />
      </Field>

      <Field label="Sunglasses">
        <InputToggle {...form.getPropsOf("hasSunglasses")} />
      </Field>

      <Field label="Beard">
        <InputToggle {...form.getPropsOf("hasBeard")} />
      </Field>

      <Field label="Mustache">
        <InputToggle {...form.getPropsOf("hasMustache")} />
      </Field>

      <Field label="Smile">
        <InputToggle {...form.getPropsOf("hasSmile")} />
      </Field>
    </Fragment>
  )
}
