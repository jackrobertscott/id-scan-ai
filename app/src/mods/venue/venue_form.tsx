import {Fragment} from "react"
import {Field} from "../../theme/Field"
import {InputString} from "../../theme/InputString"
import {useZodForm, ZodFormValue} from "../../utils/useZodForm"
import {getVenueFormSchema, VenueFormSchema} from "./venue_storeDef.iso"

export type VenueFormProps = {
  value: ZodFormValue<VenueFormSchema>
  onValue: (value: ZodFormValue<VenueFormSchema>) => void
}

export const VenueForm = ({value, onValue}: VenueFormProps) => {
  const form = useZodForm({
    schema: getVenueFormSchema(),
    pushValue: value,
    onValue,
  })

  return (
    <Fragment>
      <Field label="Venue name" variant="required">
        <InputString {...form.getPropsOf("name")} />
      </Field>

      {/* <Field label="Invoice Email" variant="required">
        <InputString {...form.getPropsOf("invoiceEmail")} />
      </Field> */}

      {/* <Field label="Max Capacity">
        <InputNumber
          {...form.getPropsOf("maxCapacity")}
          placeholder="Optional"
        />
      </Field> */}

      {/* <FieldGroup label="Address">
        <VenueAddressForm
          value={form.getValueOf("address")}
          onValue={(value) => form.setValueOf("address", value)}
        />
      </FieldGroup> */}
    </Fragment>
  )
}
