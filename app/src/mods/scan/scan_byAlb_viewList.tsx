import {mdiAlertCircle} from "@mdi/js"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {Fragment} from "react/jsx-runtime"
import {z} from "zod"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {GridGallery} from "../../theme/GridGallery"
import {ListOptions} from "../../theme/ListOptions"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {getCachedSignedUrl} from "../../utils/signedUrlCacheUtils"
import {idSchema} from "../../utils/zodSchema"
import {AlbumDef} from "../album/album_storeDef.iso"
import {scan_byAlb_eDef} from "./scan_byAlb_eDef.iso"
import {ReadScanByAlbumView} from "./scan_byAlb_viewRead"

export type ListScanByAlbumViewProps = {}

export const ListScanByAlbumView = ({}: ListScanByAlbumViewProps) => {
  const params = useParams()
  const [scanId, setScanId] = useState<string>()
  const [albumId, setAlbumId] = useState<string>()
  const [invalidId, setInvalidId] = useState(false)

  const $listScans = useEdge(scan_byAlb_eDef.list, {
    fetchOnChangeDebounce: 500,
    pushValue: {
      albumId,
      sortKey: "createdDate",
      sortDir: "desc",
    },
  })

  useEffect(() => {
    const result = z.object({albumId: idSchema()}).safeParse({
      albumId: [AlbumDef.prefix, params.albumId].join("_"),
    })
    if (result.success) setAlbumId(result.data.albumId)
    else setInvalidId(true)
  }, [params])

  if (invalidId) {
    return (
      <Spacer>
        <TitleBar title="View Scans" />
        <Poster
          icon={mdiAlertCircle}
          title="Invalid Album ID"
          desc="The album ID in the URL is invalid"
        />
      </Spacer>
    )
  }

  return (
    <Fragment>
      {scanId && albumId && (
        <ReadScanByAlbumView
          scanId={scanId}
          albumId={albumId}
          onClose={() => setScanId(undefined)}
        />
      )}

      <Spacer>
        <TitleBar title="View Scans" />

        <ListOptions
          data={$listScans.output?.scans}
          total={$listScans.output?.total}
          value={$listScans.input.getData()}
          onValue={$listScans.input.patchData}
          sortKeys={[
            {
              label: "Date of Birth",
              value: "docPhoto.documentMeta.dobDate",
            },
          ]}></ListOptions>

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
                    onClick: () => setScanId(scan.id),
                  }
                })}
              />
            </Field>
          )}
        />
      </Spacer>
    </Fragment>
  )
}
