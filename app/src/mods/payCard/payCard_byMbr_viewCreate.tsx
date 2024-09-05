import {mdiCreditCardCheck} from "@mdi/js"
import {Token} from "@stripe/stripe-js"
import {useRef} from "react"
import {Button} from "../../theme/Button"
import {Field} from "../../theme/Field"
import {InputString} from "../../theme/InputString"
import {InputStripeCard} from "../../theme/InputStripeCard"
import {Modal} from "../../theme/Modal"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, createPageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {payCard_byMember_eDef} from "./payCard_byMember_eDef.iso"

export type CreatePayCardByMemberViewProps = {
  onClose: (id?: string) => void
}

export const CreatePayCardByMemberView = ({
  onClose,
}: CreatePayCardByMemberViewProps) => {
  const getTokenCbRef = useRef<(() => Promise<Token | undefined>) | undefined>()
  const $createPayCard = useEdge(payCard_byMember_eDef.create, {
    successMessage: "Pay card created",
  })

  const handleSubmit = $createPayCard.wrapLoadingEffect(async () => {
    const token = await getTokenCbRef.current?.()
    if (!token) return
    $createPayCard.input.setValueOf("stripeToken", token.id)
    const i = await $createPayCard.unwrappedFetch()
    onClose(i.id)
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar title="Pay Card" options={createPageOptions(onClose)} />

        <Poster
          icon={mdiCreditCardCheck}
          title="Pay Card"
          description="See our pricing page for details"
        />

        <Field label="Name on card" variant="required">
          <InputString {...$createPayCard.input.getPropsOf("nameOnCard")} />
        </Field>

        <Field label="Card number" variant="required">
          <InputStripeCard getTokenCbRef={getTokenCbRef} />
        </Field>

        <Button
          bgColor="var(--bg-blu)"
          label="Create PayCard"
          {...$createPayCard.getSubmitProps()}
          onClick={handleSubmit}
        />
      </Spacer>
    </Modal>
  )
}
