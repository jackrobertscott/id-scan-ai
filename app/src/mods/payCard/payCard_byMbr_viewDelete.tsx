import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {payCard_byMember_eDef} from "./payCard_byMember_eDef.iso"

export type DeletePayCardByMemberViewProps = {
  onDelete: () => void
  payCardId: string
}

export const DeletePayCardByMemberView = ({
  onDelete,
  payCardId,
}: DeletePayCardByMemberViewProps) => {
  const $deletePayCard = useEdge(payCard_byMember_eDef.delete, {
    successMessage: "Pay card deleted",
    pushValue: {payCardId},
  })

  return (
    <DeleteModal
      noun="Pay Card"
      loading={$deletePayCard.loading}
      onDelete={() => $deletePayCard.fetch().then(() => onDelete())}
    />
  )
}
