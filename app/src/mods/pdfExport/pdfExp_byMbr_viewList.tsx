import {mdiFileDocument} from "@mdi/js"
import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {ListOptions} from "../../theme/ListOptions"
import {Poster} from "../../theme/Poster"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {CreatePdfExportByMemberView} from "./pdfExp_byMbr_viewCreate"
import {ReadPdfExportByMemberView} from "./pdfExp_byMbr_viewRead"
import {pdfExport_byMember_eDef} from "./pdfExport_byMember_eDef.iso"

export const ListPdfExportByMemberView = () => {
  const $listPdfExports = useEdge(pdfExport_byMember_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listPdfExports.fetch(),
    renderCreate: (onClose) => (
      <CreatePdfExportByMemberView onClose={onClose} />
    ),
    renderRead: (onClose, id) => (
      <ReadPdfExportByMemberView pdfExportId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Pdf Exports" options={[crud.titleBarOptionCreate]} />

      <Poster
        icon={mdiFileDocument}
        title="PDF Exports"
        description="Export your data to a PDF file"
      />

      <ListOptions
        showDates
        data={$listPdfExports.output?.pdfExports}
        total={$listPdfExports.output?.total}
        value={$listPdfExports.input.getData()}
        onValue={$listPdfExports.input.patchData}
        sortKeys={[]}>
        {/* todo */}
      </ListOptions>

      <EmptyListWrap
        label="No Pdf Exports Yet"
        ready={$listPdfExports.ready}
        data={$listPdfExports.output?.pdfExports}
        render={(pdfExports) => (
          <Field>
            <SimpleList
              options={pdfExports.map((pdfExport) => ({
                key: pdfExport.id,
                label: pdfExport.name,
                description: pdfExport.createdDate.toLocaleString("en-au", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }),
                onClick: () => crud.onOpenRead(pdfExport.id),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
