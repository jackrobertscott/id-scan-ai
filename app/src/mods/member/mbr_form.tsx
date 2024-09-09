import {Fragment} from "react"
import {Button} from "../../theme/Button"
import {ComingSoon} from "../../theme/ComingSoon"
import {Field} from "../../theme/Field"
import {FieldGroup} from "../../theme/FieldGroup"
import {InputMultiSelect} from "../../theme/InputMultiSelect"
import {InputToggleConfirm} from "../../theme/InputToggleConfirm"
import {toSentenceCase, toSpacedCase} from "../../utils/changeCase"
import {useZodForm, ZodFormValue} from "../../utils/useZodForm"
import {
  getMemberByMemberFormSchema,
  MEMBER_PERMISSIONS_ARRAY,
  MemberByMemberFormSchema,
} from "./member_storeDef.iso"

export type MemberByMemberFormProps = {
  value: ZodFormValue<MemberByMemberFormSchema>
  onValue: (value: ZodFormValue<MemberByMemberFormSchema>) => void
}

export const MemberByMemberForm = ({
  value,
  onValue,
}: MemberByMemberFormProps) => {
  const form = useZodForm({
    schema: getMemberByMemberFormSchema(),
    pushValue: value,
    onValue,
  })

  return (
    <Fragment>
      {/* Full Access */}
      <Field footNote="A member with full access will be able to delete a venue or any of its assets">
        <InputToggleConfirm
          {...form.getPropsOf("fullAccess")}
          getLabel={(value) => (value ? "Full Access" : "Limited Access")}
          getPoster={(value) => ({
            title: !value ? "Full Access" : "Limited Access",
            desc: !value
              ? "This member will have full access to all venues and assets."
              : "This member will have limited access to specific venues and assets.",
          })}
        />
      </Field>

      {/* Permissions */}
      {!form.getValueOf("fullAccess") && (
        <FieldGroup label="Permissions">
          <Field>
            <InputMultiSelect
              {...form.getPropsOf("permissions")}
              options={MEMBER_PERMISSIONS_ARRAY.map((permission) => ({
                value: permission,
                label: toSentenceCase(toSpacedCase(permission)),
              }))}
            />
          </Field>
          <ComingSoon
            render={(doShow) => (
              <Button label="Use Template" onClick={doShow} />
            )}
          />
        </FieldGroup>
      )}
    </Fragment>
  )
}
