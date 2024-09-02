import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {GridGallery} from "../../theme/GridGallery"
import {ListOptions} from "../../theme/ListOptions"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {getCachedSignedUrl} from "../../utils/signedUrlCacheUtils"
import {CreateScanByMemberView} from "./scan_byMbr_viewCreate"
import {ReadScanByMemberView} from "./scan_byMbr_viewRead"
import {scan_byMember_eDef} from "./scan_byMember_eDef.iso"
import {ScanFilterForm} from "./scan_formFilter"

export const ListScanByMemberView = () => {
  const $listScans = useEdge(scan_byMember_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listScans.fetch(),
    renderCreate: (onClose) => (
      <Modal>
        <CreateScanByMemberView onClose={onClose} />
      </Modal>
    ),
    renderRead: (onClose, id) => (
      <ReadScanByMemberView scanId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Scans" options={[crud.titleBarOptionCreate]} />

      <ListOptions
        data={$listScans.output?.scans}
        total={$listScans.output?.total}
        value={$listScans.input.getData()}
        onValue={$listScans.input.patchData}
        sortKeys={[
          {label: "Date of Birth", value: "docPhoto.documentMeta.dobDate"},
        ]}>
        <ScanFilterForm
          value={$listScans.input.getData()}
          onValue={$listScans.input.patchData}
        />
      </ListOptions>

      <EmptyListWrap
        label="No Scans Yet"
        ready={$listScans.ready}
        data={$listScans.output?.scans}
        render={(scans) => (
          <Field>
            <GridGallery
              data={scans.map((scan) => {
                const livePhotoUrl = getCachedSignedUrl(
                  `${scan.id}:livePhotoUrl`,
                  scan.livePhotoUrl
                )
                const docPhotoUrl = getCachedSignedUrl(
                  `${scan.id}:docPhotoUrl`,
                  scan.docPhotoUrl
                )
                return {
                  key: scan.id,
                  imagePreviewUrls: [livePhotoUrl, docPhotoUrl],
                  caption: scan.createdDate.toLocaleString("en-au", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }),
                  onClick: () => crud.onOpenRead(scan.id),
                }
              })}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
