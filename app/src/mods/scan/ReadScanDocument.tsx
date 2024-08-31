import {Field} from "../../theme/Field"
import {FieldGroup} from "../../theme/FieldGroup"
import {InputStatic} from "../../theme/InputStatic"
import {toSentenceCase, toSpacedCase} from "../../utils/changeCase"
import {ScanType} from "./scan_storeDef.iso"

export type ReadScanDocumentProps = {
  documentMeta: ScanType["docMeta"]
}

export const ReadScanDocument = ({documentMeta}: ReadScanDocumentProps) => {
  const {birthDate, docRegion, docType, licenceNo, postCode, suburb} =
    documentMeta

  if (!Object.values(documentMeta).filter((i) => i).length) {
    return (
      <Field label="Document Details">
        <InputStatic label="No details available" />
      </Field>
    )
  }

  return (
    <FieldGroup label="Document Details">
      {suburb && (
        <Field label="Suburb">
          <InputStatic label={suburb} />
        </Field>
      )}

      {postCode && (
        <Field label="Post code">
          <InputStatic label={postCode} />
        </Field>
      )}

      {birthDate && (
        <Field label="Birth Date">
          <InputStatic
            label={new Date(birthDate).toLocaleString("en-au", {
              dateStyle: "medium",
            })}
          />
        </Field>
      )}

      {docType && (
        <Field label="Document type">
          <InputStatic label={toSentenceCase(toSpacedCase(docType))} />
        </Field>
      )}

      {docRegion && (
        <Field label="Document region">
          <InputStatic label={toSentenceCase(toSpacedCase(docRegion))} />
        </Field>
      )}

      {licenceNo && (
        <Field label="Licence number">
          <InputStatic label={licenceNo} />
        </Field>
      )}
    </FieldGroup>
  )
}
