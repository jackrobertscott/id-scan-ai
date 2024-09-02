import {Fragment} from "react"
import {Field} from "../../theme/Field"
import {InputNumber} from "../../theme/InputNumber"
import {InputSelect} from "../../theme/InputSelect"
import {InputString} from "../../theme/InputString"
import {toSentenceCase} from "../../utils/changeCase"
import {useZodForm, ZodFormValue} from "../../utils/useZodForm"
import {
  FaceTagFormSchema,
  getFaceTagFormSchema,
  TAG_CATEGORIES_ARRAY,
  TAG_TIME_LENGTH_UNITS_ARRAY,
} from "./faceTag_storeDef.iso"

export type FaceTagFormProps = {
  value: ZodFormValue<FaceTagFormSchema>
  onValue: (value: ZodFormValue<FaceTagFormSchema>) => void
}

export const FaceTagForm = ({value, onValue}: FaceTagFormProps) => {
  const form = useZodForm({
    schema: getFaceTagFormSchema(),
    pushValue: {...value},
    onValue,
  })

  return (
    <Fragment>
      <Field label="Category" variant="required">
        <InputSelect
          {...form.getPropsOf("category")}
          options={TAG_CATEGORIES_ARRAY.map((category) => ({
            value: category,
            label: toSentenceCase(category),
          }))}
        />
      </Field>

      <Field label="Description" variant="required">
        <InputString {...form.getPropsOf("desc")} />
      </Field>

      <Field label="Time length">
        <InputNumber {...form.getPropsOf("timeAmount")} />
        <InputSelect
          {...form.getPropsOf("timeUnit")}
          options={TAG_TIME_LENGTH_UNITS_ARRAY.map((unit) => ({
            value: unit,
            label: toSentenceCase(unit),
          }))}
        />
      </Field>
    </Fragment>
  )
}
