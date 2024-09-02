import {useEffect} from "react"
import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, createPageOptions} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {pdfExport_byMember_eDef} from "./pdfExport_byMember_eDef.iso"
import {PdfExportForm} from "./pdfExport_form"

export type CreatePdfExportByMemberViewProps = {
  onClose: (id?: string) => void
}

export const CreatePdfExportByMemberView = ({
  onClose,
}: CreatePdfExportByMemberViewProps) => {
  const $createPdfExport = useEdge(pdfExport_byMember_eDef.create, {
    successMessage: "Pdf export created",
  })

  useEffect(() => {
    const today = new Date()
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)
    $createPdfExport.input.patchData({
      filters: {
        createdAfterDate: lastWeek,
        createdBeforeDate: today,
      },
    })
  }, [])

  return (
    <Modal>
      <Spacer>
        <TitleBar title="Pdf Export" options={createPageOptions(onClose)} />

        <PdfExportForm
          value={$createPdfExport.input.getData()}
          onValue={$createPdfExport.input.patchData}
        />

        <Button
          // variant="blue"
          label="Create Pdf Export"
          {...$createPdfExport.getSubmitProps((data) => onClose(data.id))}
        />
      </Spacer>
    </Modal>
  )
}
