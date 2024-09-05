import {mdiClose} from "@mdi/js"
import {useEffect, useState} from "react"
import {Fragment} from "react/jsx-runtime"
import {Button} from "../../theme/Button"
import {DisplayImage} from "../../theme/DisplayImage"
import {Divider} from "../../theme/Divider"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {GridGallery} from "../../theme/GridGallery"
import {InputCamera} from "../../theme/InputCamera"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {getCachedSignedUrl} from "../../utils/signedUrlCacheUtils"
import {ReadScanByMemberView} from "./scan_byMbr_viewRead"
import {scan_byMember_eDef} from "./scan_byMember_eDef.iso"

export type CreateScanByMemberViewProps = {
  onClose?: () => void
}

export const CreateScanByMemberView = ({
  onClose,
}: CreateScanByMemberViewProps) => {
  // Patron photo assets
  const $uploadLivePhoto = useEdge(scan_byMember_eDef.uploadLivePhoto)
  const [livePhotoId, setLivePhotoId] = useState<string>()
  const {livePhotoUrl} = $uploadLivePhoto.output ?? {}

  // Document photo assets
  const [newDocPhoto, setNewDocPhoto] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string
    photoUrl: string
  }>()
  const $uploadDocAndCreateScan = useEdge(
    scan_byMember_eDef.uploadDocPhotoAndCreate,
    {successMessage: "Scan created"}
  )
  const $createScanOfOldDocument = useEdge(
    scan_byMember_eDef.createFromOldDocPhoto,
    {successMessage: "Scan created"}
  )
  const $listSimilarPhotos = useEdge(scan_byMember_eDef.listSimilarDocPhotos)

  // Show the final scan details (and tags)
  const [showScanId, setShowScanId] = useState<string>()

  // handle success create
  const handleSuccess = (data: {id: string}) => {
    setShowScanId(data.id)
  }

  // Set the patron's face photo in the document upload request
  useEffect(() => {
    if (livePhotoId) {
      $uploadDocAndCreateScan.input.patchData({livePhotoId})
      $listSimilarPhotos.fetch({livePhotoId: livePhotoId})
    }
  }, [livePhotoId])

  if (showScanId) {
    return (
      <ReadScanByMemberView
        scanId={showScanId}
        onClose={() => {
          if (onClose) onClose()
          else location.reload()
        }}
      />
    )
  }

  return (
    <Spacer>
      <TitleBar
        title="New Scan"
        options={[
          onClose && {icon: mdiClose, label: "Cancel", onClick: onClose},
        ]}
      />

      {(() => {
        // Step 1: Patron photo upload
        if (!livePhotoId) {
          return (
            <Field grow label="Patron Photo">
              <InputCamera
                label="Patron"
                loading={$uploadLivePhoto.loading}
                value={$uploadLivePhoto.input.getValueOf("livePhotoFile")}
                onValue={(pf) => {
                  // Seperate the photo upload from the face photo id
                  // So that you can have the "preview" image appear
                  $uploadLivePhoto.input.setValueOf("livePhotoFile", pf)
                  $uploadLivePhoto.fetch().then((data) => {
                    setLivePhotoId(data.livePhotoId)
                  })
                }}
              />
            </Field>
          )
        }

        // Step 2: Select previous or go to new document photo upload screen
        if (!newDocPhoto) {
          return (
            <Fragment>
              <Button
                label="New Document Photo"
                onClick={() => setNewDocPhoto(true)}
              />

              <Divider />

              <EmptyListWrap
                label="No Previous Scans Found"
                ready={$listSimilarPhotos.ready}
                data={$listSimilarPhotos.output?.docPhotos}
                render={(facePhotos) => (
                  <Field label="Past scans of patron">
                    <GridGallery
                      data={facePhotos.map((facePhoto) => {
                        const signedUrl = getCachedSignedUrl(
                          facePhoto.id,
                          facePhoto.photoUrl
                        )
                        return {
                          key: facePhoto.id,
                          imagePreviewUrls: [signedUrl],
                          caption: facePhoto.createdDate.toLocaleString(
                            "en-au",
                            {dateStyle: "short", timeStyle: "short"}
                          ),
                          onClick: () => setSelectedDocument(facePhoto),
                        }
                      })}
                    />
                  </Field>
                )}
              />

              {selectedDocument && livePhotoUrl && (
                <Modal>
                  <Spacer>
                    <Field label="Patron Photo">
                      <DisplayImage
                        alt="Patron Photo"
                        source={livePhotoUrl}
                        aspectRatio={1}
                      />
                    </Field>

                    <Field label="Document Photo">
                      <DisplayImage
                        alt="Document Photo"
                        source={selectedDocument.photoUrl}
                        aspectRatio={1}
                      />
                    </Field>

                    <Button
                      bgColor="var(--bg-grn)"
                      label="Face Match"
                      {...$createScanOfOldDocument.getSubmitProps()}
                      onClick={() => {
                        $createScanOfOldDocument
                          .fetch({
                            livePhotoId,
                            docPhotoId: selectedDocument.id,
                          })
                          .then(handleSuccess)
                      }}
                    />

                    <Button
                      bgColor="var(--bg-red)"
                      label="Does Not Match"
                      onClick={() => setSelectedDocument(undefined)}
                    />
                  </Spacer>
                </Modal>
              )}
            </Fragment>
          )
        }

        // Step 3: Document photo upload
        return (
          <Field grow label="Document Photo">
            <InputCamera
              label="Patron"
              loading={$uploadDocAndCreateScan.loading}
              value={$uploadDocAndCreateScan.input.getValueOf("docPhotoFile")}
              onValue={(pf) => {
                $uploadDocAndCreateScan.input.setValueOf("docPhotoFile", pf)
                $uploadDocAndCreateScan.fetch().then(handleSuccess)
              }}
            />
          </Field>
        )
      })()}
    </Spacer>
  )
}
