import {mdiClose, mdiHistory, mdiTagOutline, mdiTrashCan} from "@mdi/js"
import {useState} from "react"
import {Fragment} from "react/jsx-runtime"
import {Button} from "../../theme/Button"
import {ComingSoon} from "../../theme/ComingSoon"
import {DisplayImage} from "../../theme/DisplayImage"
import {Divider} from "../../theme/Divider"
import {Field} from "../../theme/Field"
import {InputStatic} from "../../theme/InputStatic"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {dateDiff} from "../docPhoto/docPhoto_parseDob"
import {CreateTagByMemberView} from "../faceTag/faceTag_byMbr_viewCreate"
import {UpdateTagByMemberView} from "../faceTag/faceTag_byMbr_viewUpdate"
import {ListSimilarPatronByMemberView} from "../livePhoto/livePhoto_byMbr_viewListSimilar"
import {scan_byMember_eDef} from "./scan_byMember_eDef.iso"
import {ReadScanDocument} from "./scan_formDoc"
import {ReadScanFace} from "./scan_formFace"

export type ReadScanByMemberViewProps = {
  scanId: string
  onClose: () => void
}

export const ReadScanByMemberView = ({
  scanId,
  onClose,
}: ReadScanByMemberViewProps) => {
  const [showTagId, setShowTagId] = useState<string | null>()
  const [showTagCreate, setShowTagCreate] = useState(false)
  const [patronFaceSearchId, setPatronFaceSearchId] = useState<string | null>()

  const $getScan = useEdge(scan_byMember_eDef.get, {
    pushValue: {scanId},
    fetchOnMount: true,
  })

  return (
    <Fragment>
      {patronFaceSearchId && (
        <Modal>
          <ListSimilarPatronByMemberView
            livePhotoId={patronFaceSearchId}
            onClose={() => setPatronFaceSearchId(null)}
          />
        </Modal>
      )}

      {showTagCreate && (
        <CreateTagByMemberView
          scanId={scanId}
          onClose={() => {
            setShowTagCreate(false)
            $getScan.fetch()
          }}
        />
      )}

      {showTagId && (
        <UpdateTagByMemberView
          tagId={showTagId}
          onClose={() => {
            setShowTagId(null)
            $getScan.fetch()
          }}
        />
      )}

      <Modal>
        <Spacer>
          <TitleBar
            title="View Scan"
            options={[
              {
                icon: mdiTagOutline,
                label: "Tag Patron",
                onClick: () => setShowTagCreate(true),
                iconScale: 0.8,
              },
              {
                icon: mdiClose,
                label: "Close",
                onClick: onClose,
              },
            ]}
          />

          <LoadingScreen
            data={$getScan.output}
            render={({scan, tags}) => {
              const {birthDate} = scan.docMeta
              const dobDiff = birthDate
                ? dateDiff(birthDate, new Date())
                : undefined
              return (
                <Fragment>
                  {tags && tags.length > 0 && (
                    <Field label="Tags">
                      <SimpleList
                        options={tags.map((tag) => {
                          // let variant: ThemeColorVariant | undefined
                          // switch (tag.category.toLowerCase()) {
                          //   case "note":
                          //     variant = "blue"
                          //     break
                          //   case "drugs":
                          //   case "fighting":
                          //     variant = "red"
                          //     break
                          // }
                          const expiryDateString = new Date(
                            tag.expiry.date
                          ).toLocaleString("en-au", {dateStyle: "medium"})
                          return {
                            label: tag.desc,
                            desc: `Expires ${expiryDateString}`,
                            onClick: () => setShowTagId(tag.id),
                          }
                        })}
                      />
                    </Field>
                  )}

                  <Spacer direction="row" slim mobileCollapse>
                    <Field
                      // bg={scan.faceSimilarity >= 80 ? "green" : "red"}
                      label="Face ID Comparison">
                      <InputStatic
                        label={`${Math.round(scan.faceSimilarity)}% Similary`}
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
                  </Spacer>

                  <Spacer direction="row" slim mobileCollapse>
                    <Field label="Patron Photo">
                      <DisplayImage
                        alt="Patron Photo"
                        source={scan.livePhotoUrl}
                      />
                    </Field>

                    <Field label="Document Photo">
                      <DisplayImage
                        alt="Document Photo"
                        source={scan.docPhotoUrl}
                      />
                    </Field>
                  </Spacer>
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

                  <Divider />

                  <Button
                    bgColor="var(--bg-blu)"
                    label="View patron's history"
                    icon={mdiHistory}
                    onClick={() => setPatronFaceSearchId(scan.livePhotoId)}
                  />

                  <ComingSoon
                    render={(doShow) => (
                      <Button
                        bgColor="var(--bg-red)"
                        label="Delete scan"
                        icon={mdiTrashCan}
                        onClick={() => doShow()}
                      />
                    )}
                  />
                </Fragment>
              )
            }}
          />
        </Spacer>
      </Modal>
    </Fragment>
  )
}
