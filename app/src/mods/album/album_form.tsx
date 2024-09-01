import {Fragment} from "react"
import {z} from "zod"
import {Divider} from "../../theme/Divider"
import {Field} from "../../theme/Field"
import {FieldGroup} from "../../theme/FieldGroup"
import {InputString} from "../../theme/InputString"
import {InputStringArray} from "../../theme/InputStringArray"
import {InputToggle} from "../../theme/InputToggle"
import {ZodFormValue, useZodForm} from "../../utils/useZodForm"
import {ScanFilterForm} from "../scan/scan_formFilter"
import {AlbumFormSchema, getAlbumFormSchema} from "./album_storeDef.iso"

export type AlbumFormProps = {
  value: ZodFormValue<AlbumFormSchema>
  onValue: (value: ZodFormValue<AlbumFormSchema>) => void
}

export const AlbumForm = ({value, onValue}: AlbumFormProps) => {
  const form = useZodForm({
    schema: getAlbumFormSchema(),
    pushValue: value,
    onValue,
  })

  return (
    <Fragment>
      <Field
        label="Label"
        variant="required"
        footNote="Add a short description for the album">
        <InputString {...form.getPropsOf("name")} />
      </Field>

      <Field label="Emails" variant="required">
        <InputStringArray
          {...form.getPropsOf("emails")}
          placeholder="example@email.com"
          validate={{
            schema: z.string().email(),
            errorMessage: "Please check the formatting of the email address",
          }}
        />
      </Field>

      <Field
        label="Is Active"
        footNote="A album must be active to allow users to view its content">
        <InputToggle {...form.getPropsOf("isActive")} />
      </Field>

      <Divider />

      <FieldGroup label="Filters">
        <ScanFilterForm {...form.getPropsOf("filters")} />
      </FieldGroup>
    </Fragment>
  )
}
