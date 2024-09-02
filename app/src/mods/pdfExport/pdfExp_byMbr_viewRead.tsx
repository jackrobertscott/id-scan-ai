import {mdiClose} from "@mdi/js"
import {Fragment} from "react/jsx-runtime"
import {Button} from "../../theme/Button"
import {Divider} from "../../theme/Divider"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {DeletePdfExportByMemberView} from "./pdfExp_byMbr_viewDelete"
import {pdfExport_byMember_eDef} from "./pdfExport_byMember_eDef.iso"
import {PdfExportForm} from "./pdfExport_form"

export type ReadPdfExportByMemberViewProps = {
  pdfExportId: string
  onClose: () => void
}

export const ReadPdfExportByMemberView = ({
  pdfExportId,
  onClose,
}: ReadPdfExportByMemberViewProps) => {
  const $getPdfExport = useEdge(pdfExport_byMember_eDef.get, {
    pushValue: {pdfExportId},
    fetchOnMount: true,
  })
  const $downloadPdfExport = useEdge(pdfExport_byMember_eDef.download, {
    pushValue: {pdfExportId},
  })

  return (
    <Modal>
      <Spacer>
        <TitleBar
          title="Pdf Export"
          options={[{icon: mdiClose, label: "Close", onClick: onClose}]}
        />

        <LoadingScreen
          data={$getPdfExport.output}
          render={({pdfExport}) => (
            <Fragment>
              {pdfExport.pdfUrl && (
                <Button
                  // variant="blue"
                  label="Download PDF"
                  {...$downloadPdfExport.getSubmitProps(async (response) => {
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = pdfExport.name.trim() + ".pdf"
                    a.click()
                    a.remove()
                  })}
                />
              )}

              <PdfExportForm disabled value={pdfExport} />
            </Fragment>
          )}
        />

        <Divider />

        <DeletePdfExportByMemberView
          pdfExportId={pdfExportId}
          onDelete={() => onClose()}
        />
      </Spacer>
    </Modal>
  )
}
