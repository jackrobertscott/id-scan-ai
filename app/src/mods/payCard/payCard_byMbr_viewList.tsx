import {mdiCreditCard} from "@mdi/js"
import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {Poster} from "../../theme/Poster"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {CreatePayCardByMemberView} from "./payCard_byMbr_viewCreate"
import {UpdatePayCardByMemberView} from "./payCard_byMbr_viewUpdate"
import {payCard_byMember_eDef} from "./payCard_byMember_eDef.iso"

export const ListPayCardByMemberView = () => {
  const $listPayCards = useEdge(payCard_byMember_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
  })

  const crud = useCrudState({
    refetch: () => $listPayCards.fetch(),
    renderCreate: (onClose) => <CreatePayCardByMemberView onClose={onClose} />,
    renderRead: (onClose, id) => (
      <UpdatePayCardByMemberView payCardId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Pay Cards" options={[crud.titleBarOptionCreate]} />

      <Poster
        icon={mdiCreditCard}
        title="Payment Cards"
        description="Your payment methods"
      />

      <EmptyListWrap
        label="No Pay Cards Yet"
        ready={$listPayCards.ready}
        data={$listPayCards.output?.payCards}
        render={(payCards) => (
          <Field>
            <SimpleList
              options={payCards.map((payCard) => ({
                key: payCard.id,
                label: `**** **** **** ${payCard.last4}`,
                description: `${payCard.brand} ${payCard.expMonth}/${payCard.expYear}`,
                onClick: () => crud.onOpenRead(payCard.id),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
