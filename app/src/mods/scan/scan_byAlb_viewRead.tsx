import {mdiClose} from "@mdi/js"
import {Fragment} from "react/jsx-runtime"
import {DisplayImage} from "../../theme/DisplayImage"
import {Field} from "../../theme/Field"
import {InputStatic} from "../../theme/InputStatic"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {dateDiff} from "../docPhoto/docPhoto_parseDob"
import {scan_byAlb_eDef} from "./scan_byAlb_eDef.iso"
import {ReadScanDocument} from "./scan_formDoc"
import {ReadScanFace} from "./scan_formFace"

export type ReadScanByAlbumViewProps = {
  scanId: string
  albumId: string
  onClose: () => void
}

export const ReadScanByAlbumView = ({
  scanId,
  albumId,
  onClose,
}: ReadScanByAlbumViewProps) => {
  const $getScan = useEdge(scan_byAlb_eDef.get, {
    pushValue: {scanId, albumId},
    fetchOnMount: true,
  })

  return (
    <Modal size="large">
      <Spacer>
        <TitleBar
          title="View Scan"
          options={[{icon: mdiClose, label: "Close", onClick: onClose}]}
        />

        <LoadingScreen
          data={$getScan.output}
          render={({scan}) => {
            const {birthDate} = scan.docMeta
            const dobDiff = birthDate
              ? dateDiff(birthDate, new Date())
              : undefined
            return (
              <Fragment>
                <Field
                  // bg={scan.faceSimilarity >= 80 ? "green" : "red"}
                  label="Face ID Comparison">
                  <InputStatic
                    label={`${Math.round(scan.faceSimilarity)}% Similarity`}
                  />
                </Field>

                <Field
                  // bg={dobDiff && dobDiff[0] > 18 ? "green" : "red"}
                  label="Age">
                  <InputStatic
                    label={
                      dobDiff
                        ? `${dobDiff[0]} years ${dobDiff[1]} months ${dobDiff[2]} days`
                        : "Unknown"
                    }
                  />
                </Field>

                <Field label="Patron Photo">
                  <DisplayImage alt="Patron Photo" source={scan.livePhotoUrl} />
                </Field>

                <Field label="Document Photo">
                  <DisplayImage
                    alt="Document Photo"
                    source={scan.docPhotoUrl}
                  />
                </Field>

                <ReadScanFace faceMeta={scan.liveFaceMeta} />

                <ReadScanDocument documentMeta={scan.docMeta} />

                <Field label="Created date">
                  <InputStatic
                    label={scan.createdDate.toLocaleString("en-au", {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    })}
                  />
                </Field>
              </Fragment>
            )
          }}
        />
      </Spacer>
    </Modal>
  )
}
