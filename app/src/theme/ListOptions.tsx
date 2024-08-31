import {mdiChevronLeft, mdiChevronRight, mdiClose, mdiFilter} from "@mdi/js"
import {Fragment, ReactNode, useState} from "react"
import {toCapitalCase, toSpacedCase} from "../utils/changeCase"
import {listOptionsSchema} from "../utils/mongo/listOptionUtils"
import {ZodFormValue, useZodForm} from "../utils/useZodForm"
import {Field} from "./Field"
import {FieldGroup} from "./FieldGroup"
import {InputButton} from "./InputButton"
import {InputDate} from "./InputDate"
import {InputNumber} from "./InputNumber"
import {InputSelect, InputSelectOption} from "./InputSelect"
import {InputStatic} from "./InputStatic"
import {InputString} from "./InputString"
import {Modal} from "./Modal"
import {Spacer} from "./Spacer"
import {TitleBar} from "./TitleBar"

type ListOptionSchema = ReturnType<typeof listOptionsSchema>["shape"]

export type ListOptionsProps = {
  data?: any[]
  total?: number
  showDates?: boolean
  value: ZodFormValue<ListOptionSchema>
  onValue: (value: ZodFormValue<ListOptionSchema>) => void
  sortKeys: Array<InputSelectOption | string>
  children?: ReactNode
}

export const ListOptions = ({
  data,
  total,
  showDates,
  value,
  onValue,
  sortKeys,
  children,
}: ListOptionsProps) => {
  const [showOptions, setShowOptions] = useState(false)

  const form = useZodForm({
    schema: listOptionsSchema(),
    pushValue: {page: 0, limit: 50, ...value},
    onValue,
  })

  let {page, limit} = form.getData()
  page ??= 0
  const hasPrev = page > 0
  const maxPage = total && limit ? Math.floor(total / limit) : 0
  const hasNext = maxPage && page < maxPage
  const onPrev = () => form.setValueOf("page", Math.max(page - 1, 0))
  const onNext = () => form.setValueOf("page", Math.min(page + 1, maxPage))

  return (
    <Fragment>
      <Field>
        <InputString {...form.getPropsOf("search")} placeholder="Search" />
        <InputButton
          label="Options"
          icon={mdiFilter}
          onClick={() => setShowOptions(true)}
        />
      </Field>

      <Modal show={showOptions}>
        <Spacer>
          <TitleBar
            title="Options"
            options={[
              {
                icon: mdiClose,
                label: "Close",
                onClick: () => setShowOptions(false),
              },
            ]}
          />

          <Field label="Search">
            <InputString {...form.getPropsOf("search")} />
          </Field>

          <FieldGroup label="Pagination">
            {typeof total === "number" && (
              <Field
                label="Showing"
                // bg="disabled"
                grow>
                <InputStatic label={`${data?.length ?? "..."} of ${total}`} />
              </Field>
            )}

            <Field label="Page">
              <InputButton
                disabled={!hasPrev}
                icon={mdiChevronLeft}
                onClick={onPrev}
              />
              <InputNumber {...form.getPropsOf("page")} min={0} max={maxPage} />
              <InputButton
                disabled={!hasNext}
                icon={mdiChevronRight}
                onClick={onNext}
              />
            </Field>

            <Field label="Results per page" grow>
              <InputSelect<true, number>
                {...form.getPropsOf("limit")}
                required
                options={[
                  {value: 25},
                  {value: 50},
                  {value: 100},
                  {value: 200},
                ].map((i) => ({...i, label: `${i.value}`}))}
              />
            </Field>
          </FieldGroup>

          {(children || showDates) && (
            <FieldGroup label="Filters">
              {children}

              {showDates && (
                <Fragment>
                  <Field label="Created after">
                    <InputDate {...form.getPropsOf("createdAfterDate")} />
                  </Field>

                  <Field label="Created before">
                    <InputDate {...form.getPropsOf("createdBeforeDate")} />
                  </Field>
                </Fragment>
              )}
            </FieldGroup>
          )}

          <FieldGroup label="Sorting">
            <Field label="Property">
              <InputSelect
                {...form.getPropsOf("sortKey")}
                required
                options={[
                  {label: "Created Date", value: "createdDate"},
                  ...(sortKeys || []).map((i) =>
                    typeof i === "string"
                      ? {
                          label: toCapitalCase(toSpacedCase(i)),
                          value: i,
                        }
                      : i
                  ),
                ]}
              />
            </Field>

            <Field label="Direction">
              <InputSelect
                {...form.getPropsOf("sortDir")}
                required
                options={[
                  {label: "Ascending", value: "asc"},
                  {label: "Descending", value: "desc"},
                ]}
              />
            </Field>
          </FieldGroup>
        </Spacer>
      </Modal>
    </Fragment>
  )
}
