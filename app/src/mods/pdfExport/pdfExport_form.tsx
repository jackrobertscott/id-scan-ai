import {mdiLock} from "@mdi/js"
import {Fragment} from "react"
import {Field} from "../../theme/Field"
import {FieldGroup} from "../../theme/FieldGroup"
import {InputString} from "../../theme/InputString"
import {Poster} from "../../theme/Poster"
import {useZodForm, ZodFormValue} from "../../utils/useZodForm"
import {ScanFilterForm} from "../scan/scan_formFilter"
import {
  getPdfExportFormSchema,
  PdfExportFormSchema,
} from "./pdfExport_storeDef.iso"

export type PdfExportFormProps = {
  value: ZodFormValue<PdfExportFormSchema>
  onValue?: (value: ZodFormValue<PdfExportFormSchema>) => void
  disabled?: boolean
}

export const PdfExportForm = ({
  value,
  onValue,
  disabled,
}: PdfExportFormProps) => {
  const form = useZodForm({
    schema: getPdfExportFormSchema(),
    pushValue: value,
    onValue,
    disabled,
  })

  return (
    <Fragment>
      <Field
        label="Label"
        variant={disabled ? "locked" : "required"}
        footNote="Add a short name for the pdf">
        <InputString {...form.getPropsOf("name")} disabled={disabled} />
      </Field>

      <FieldGroup label="Filters">
        <Poster
          icon={mdiLock}
          title="Locked Filters"
          desc="You can not change the filters once the PDF is created"
        />

        <ScanFilterForm {...form.getPropsOf("filters")} disabled={disabled} />
      </FieldGroup>
    </Fragment>
  )
}
