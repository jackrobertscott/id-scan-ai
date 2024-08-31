import {FC} from "react"
import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {GridGallery} from "../../theme/GridGallery"
import {InputDate} from "../../theme/InputDate"
import {InputSelect} from "../../theme/InputSelect"
import {ListOptions} from "../../theme/ListOptions"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {toSentenceCase} from "../../utils/changeCase"
import {useEdge} from "../../utils/server/useEdge"
import {getCachedSignedUrl} from "../../utils/signedUrlCacheUtils"
import {UpdateTagByMemberView} from "./faceTag_byMbr_viewUpdate"
import {faceTag_byMember_eDef} from "./faceTag_byMember_eDef.iso"
import {TAG_CATEGORIES_ARRAY} from "./faceTag_storeDef.iso"

export const ListTagByMemberView: FC<{}> = () => {
  const $listTags = useEdge(faceTag_byMember_eDef.list, {
    fetchOnMount: true,
    fetchOnChangeDebounce: 500,
    pushValue: {sortKey: "createdDate", sortDir: "desc"},
  })

  const crud = useCrudState({
    refetch: () => $listTags.fetch(),
    renderRead: (onClose, id) => (
      <UpdateTagByMemberView tagId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Tags" options={[crud.titleBarOptionCreate]} />

      <ListOptions
        showDates
        data={$listTags.output?.tags}
        total={$listTags.output?.total}
        value={$listTags.input.getData()}
        onValue={$listTags.input.patchData}
        sortKeys={[]}>
        <Field label="Category" variant="required">
          <InputSelect
            {...$listTags.input.getPropsOf("category")}
            options={TAG_CATEGORIES_ARRAY.map((category) => ({
              value: category,
              label: toSentenceCase(category),
            }))}
          />
        </Field>

        <Field label="Expires after">
          <InputDate {...$listTags.input.getPropsOf("expiresAfterDate")} />
        </Field>

        <Field label="Expires before">
          <InputDate {...$listTags.input.getPropsOf("expiresBeforeDate")} />
        </Field>
      </ListOptions>

      <EmptyListWrap
        label="No Tags Yet"
        ready={$listTags.ready}
        data={$listTags.output?.tags}
        render={(tags) => (
          <Field>
            <GridGallery
              data={tags.map((tag) => {
                const signedUrl = tag.photoUrl
                  ? getCachedSignedUrl(tag.id, tag.photoUrl)
                  : undefined
                return {
                  key: tag.id,
                  imagePreviewUrls: [signedUrl],
                  caption: tag.createdDate.toLocaleString("en-au", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }),
                  onClick: () => crud.onOpenRead(tag.id),
                }
              })}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
