import {mdiAlertCircle} from "@mdi/js"
import {useEffect, useState} from "react"
import {useParams, useSearchParams} from "react-router-dom"
import {z} from "zod"
import {Center} from "../../theme/Center"
import {Container} from "../../theme/Container"
import {DisplayImage} from "../../theme/DisplayImage"
import {PdfPage} from "../../theme/PdfPage"
import {PdfTable} from "../../theme/PdfTable"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {toCapitalCase, toSpacedCase} from "../../utils/changeCase"
import {useEdge} from "../../utils/server/useEdge"
import {idSchema} from "../../utils/zodSchema"
import {PdfExportDef} from "../pdfExport/pdfExport_storeDef.iso"
import {scan_byPdf_eDef} from "./scan_byPdf_eDef.iso"

export type ListScanByPdfViewProps = {}

export const ListScanByPdfView = ({}: ListScanByPdfViewProps) => {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const [invalid, setInvalid] = useState(false)

  const $listScans = useEdge(scan_byPdf_eDef.list)
  const scans = $listScans.output?.scans ?? []

  useEffect(() => {
    const pdfId = [PdfExportDef.prefix, params.pdfExportId].join("_")
    const result = idSchema().safeParse(pdfId)
    if (!result.success) setInvalid(true)
    const t = searchParams.get("token")
    if (t) {
      const r = z
        .string()
        .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)
        .safeParse(t)
      if (!r.success) setInvalid(true)
      $listScans.fetch({pdfExportId: pdfId}, r.data)
    } else {
      $listScans.fetch({pdfExportId: pdfId})
    }
  }, [params])

  useEffect(() => {
    document.body.style.backgroundColor = "hsl(0, 0%, 100%)"
    return () => {
      document.body.style.backgroundColor = "hsl(0, 0%, 0%)"
    }
  }, [])

  if (invalid) {
    return (
      <Center>
        <Container>
          <Spacer>
            <TitleBar title="Failed to load PDF" />
            <Poster
              icon={mdiAlertCircle}
              title="Invalid Payload"
              desc="The provided PDF details are invalid"
            />
          </Spacer>
        </Container>
      </Center>
    )
  }

  return (
    <PdfPage inAppPreview={!searchParams.has("token")}>
      <div>
        <h1>Scans</h1>
        <p>
          {new Date().toLocaleString("en-au", {
            dateStyle: "medium",
            timeStyle: "medium",
          })}
        </p>
      </div>
      <PdfTable
        headings={[{label: "Patron"}, {label: "Document"}, {label: "Details"}]}
        rows={scans.map((scan) => ({
          key: scan.id,
          columns: [
            {
              children: (
                <DisplayImage source={scan.livePhotoUrl} width="10rem" />
              ),
            },
            {
              children: (
                <DisplayImage source={scan.docPhotoUrl} width="10rem" />
              ),
            },
            {
              children: (
                <PdfTable
                  nested
                  rows={Object.entries(scan.docMeta).map(([key, value]) => ({
                    key,
                    columns: [
                      {children: toCapitalCase(toSpacedCase(key))},
                      {
                        children: toCapitalCase(
                          toSpacedCase(value?.toString() ?? "n/a")
                        ),
                      },
                    ],
                  }))}
                />
              ),
            },
          ],
        }))}
      />
    </PdfPage>
  )
}
