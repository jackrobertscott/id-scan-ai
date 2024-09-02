import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {scan_byMember_eDef} from "./scan_byMember_eDef.iso"

export type DeleteScanByMemberViewProps = {
  onDelete: () => void
  scanId: string
}

export const DeleteScanByMemberView = ({
  onDelete,
  scanId,
}: DeleteScanByMemberViewProps) => {
  const $deleteScan = useEdge(scan_byMember_eDef.delete, {
    successMessage: "Scan deleted",
    pushValue: {scanId},
  })
  return (
    <DeleteModal
      noun="Scan"
      loading={$deleteScan.loading}
      onDelete={() => $deleteScan.fetch().then(() => onDelete())}
    />
  )
}
