import {mdiClose, mdiUndo} from "@mdi/js"
import {Fragment, useState} from "react"
import {Button} from "../../theme/Button"
import {ComingSoon} from "../../theme/ComingSoon"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {GridGallery} from "../../theme/GridGallery"
import {InputCamera} from "../../theme/InputCamera"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {getCachedSignedUrl} from "../../utils/signedUrlCacheUtils"
import {ReadScanByMemberView} from "../scan/scan_byMbr_viewRead"
import {livePhoto_byMember_eDef} from "./livePhoto_byMember_eDef.iso"

export type ListSimilarPatronByMemberViewProps = {
  livePhotoId?: string
  onClose?: () => void
}

export const ListSimilarPatronByMemberView = ({
  livePhotoId: livePhotoId,
  onClose,
}: ListSimilarPatronByMemberViewProps) => {
  const [readScanId, setReadScanId] = useState<string | null>()
  const $listSimilar = useEdge(livePhoto_byMember_eDef.listSimilar, {
    fetchOnMount: !!livePhotoId,
    pushValue: {livePhotoId},
  })

  const loaded = Array.isArray($listSimilar.output?.livePhotos)

  return (
    <Fragment>
      {readScanId && (
        <ReadScanByMemberView
          scanId={readScanId}
          onClose={() => setReadScanId(null)}
        />
      )}
      <Spacer>
        <TitleBar
          title="Face Search"
          options={[
            onClose
              ? {icon: mdiClose, label: "Cancel", onClick: onClose}
              : loaded && {
                  icon: mdiUndo,
                  label: "Reset",
                  onClick: () => $listSimilar.reset(),
                },
          ]}
        />

        {loaded ? (
          <EmptyListWrap
            label="No similar faces found"
            ready={$listSimilar.ready}
            data={$listSimilar.output?.livePhotos}
            render={(livePhotos) => (
              <Field>
                <GridGallery
                  data={livePhotos.map((livePhoto) => {
                    const signedUrl = getCachedSignedUrl(
                      livePhoto.id,
                      livePhoto.photoUrl
                    )
                    return {
                      key: livePhoto.id,
                      imagePreviewUrls: [signedUrl],
                      caption: livePhoto.createdDate.toLocaleString("en-au", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }),
                      onClick: livePhoto.scan?.id
                        ? () => setReadScanId(livePhoto.scan?.id)
                        : undefined,
                    }
                  })}
                />
              </Field>
            )}
          />
        ) : (
          <Fragment>
            <ComingSoon
              render={(doShow) => (
                <Button label="Upload A File" onClick={doShow} />
              )}
            />

            {!livePhotoId && (
              <Field grow>
                <InputCamera
                  loading={$listSimilar.loading}
                  value={$listSimilar.input.getValueOf("photoFile")}
                  onValue={(pf) => {
                    $listSimilar.input.setValueOf("photoFile", pf)
                    $listSimilar.fetch({photoFile: pf}).then((data) => {})
                  }}
                />
              </Field>
            )}
          </Fragment>
        )}
      </Spacer>
    </Fragment>
  )
}
