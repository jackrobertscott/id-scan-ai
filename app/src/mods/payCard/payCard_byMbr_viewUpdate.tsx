import {mdiCreditCard} from "@mdi/js"
import {Fragment} from "react/jsx-runtime"
import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {Field} from "../../theme/Field"
import {InputStatic} from "../../theme/InputStatic"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {QuestionModal} from "../../theme/QuestionModal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, updatePageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {DeletePayCardByMemberView} from "./payCard_byMbr_viewDelete"
import {payCard_byMember_eDef} from "./payCard_byMember_eDef.iso"

export type UpdatePayCardByMemberViewProps = {
  payCardId: string
  onClose: () => void
}

export const UpdatePayCardByMemberView = ({
  payCardId,
  onClose,
}: UpdatePayCardByMemberViewProps) => {
  const $getPayCard = useEdge(payCard_byMember_eDef.get, {
    pushValue: {payCardId},
    fetchOnMount: true,
  })
  const $setDefaultCard = useEdge(payCard_byMember_eDef.setDefault, {
    successMessage: "Default payment source updated",
    pushValue: {payCardId},
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar
          title="Pay Card"
          options={updatePageOptions(onClose, $setDefaultCard.input.hasChanged)}
        />

        <LoadingScreen
          data={$getPayCard.output?.payCard}
          render={(payCard) => (
            <Fragment>
              <Field label="Number">
                <InputStatic label={`**** **** **** ${payCard.last4}`} />
              </Field>

              <Field label="Brand">
                <InputStatic label={payCard.brand} />
              </Field>

              <Field label="Expiry">
                <InputStatic label={`${payCard.expMonth}/${payCard.expYear}`} />
              </Field>

              <Field label="Is Default">
                <InputStatic label={payCard.isDefault ? "Yes" : "No"} />
              </Field>

              {!payCard.isDefault && (
                <QuestionModal
                  poster={{
                    icon: mdiCreditCard,
                    title: "Set as Default",
                    description:
                      "Are you sure you want to set this card as the default payment source?",
                  }}
                  getButtons={(onClose) => [
                    {
                      label: "Set as Default",
                      variant: "blue",
                      ...$setDefaultCard.getSubmitProps(() => {
                        $getPayCard.fetch().then(onClose)
                      }),
                    },
                    {
                      label: "Cancel",
                      variant: "grey",
                      onClick: onClose,
                    },
                  ]}
                  render={(doOpen) => (
                    <Button
                      // variant="blue"
                      label="Save Changes"
                      onClick={doOpen}
                    />
                  )}
                />
              )}
            </Fragment>
          )}
        />

        <Divider />

        <DeletePayCardByMemberView
          payCardId={payCardId}
          onDelete={() => onClose()}
        />
      </Spacer>
    </Modal>
  )
}
