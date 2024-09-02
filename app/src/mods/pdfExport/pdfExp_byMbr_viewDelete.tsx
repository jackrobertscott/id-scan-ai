import {DeleteModal} from "../../theme/DeleteModal"
import {useEdge} from "../../utils/server/useEdge"
import {pdfExport_byMember_eDef} from "./pdfExport_byMember_eDef.iso"

export type DeletePdfExportByMemberViewProps = {
  onDelete: () => void
  pdfExportId: string
}

export const DeletePdfExportByMemberView = ({
  onDelete,
  pdfExportId,
}: DeletePdfExportByMemberViewProps) => {
  const $deletePdfExport = useEdge(pdfExport_byMember_eDef.delete, {
    successMessage: "Pdf Export deleted",
    pushValue: {pdfExportId},
  })
  return (
    <DeleteModal
      noun="Pdf Export"
      loading={$deletePdfExport.loading}
      onDelete={() => $deletePdfExport.fetch().then(() => onDelete())}
    />
  )
}
