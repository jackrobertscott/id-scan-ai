import {useCrudState} from "../../theme/CrudLayout"
import {EmptyListWrap} from "../../theme/EmptyListWrap"
import {Field} from "../../theme/Field"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {inv_byMbr_eDef} from "./inv_byMbr_eDef.iso"
import {ReadInvoiceByMemberView} from "./inv_byMbr_viewRead"

export const ListInvoiceByMemberView = () => {
  const $listInvoices = useEdge(inv_byMbr_eDef.list, {
    fetchOnMount: true,
  })

  const crud = useCrudState({
    refetch: () => $listInvoices.fetch(),
    renderRead: (onClose, id) => (
      <ReadInvoiceByMemberView invoiceId={id} onClose={onClose} />
    ),
  })

  return crud.render(
    <Spacer>
      <TitleBar title="Invoices" />

      <EmptyListWrap
        label="No Invoices Yet"
        ready={$listInvoices.ready}
        data={$listInvoices.output?.invoices}
        render={(invoices) => (
          <Field>
            <SimpleList
              options={invoices.map((invoice) => ({
                key: invoice.id,
                label: invoice.createdDate.toLocaleString("en-au", {
                  dateStyle: "medium",
                }),
                desc: `${(invoice.amountDue / 100).toLocaleString("en-au", {
                  style: "currency",
                  currency: invoice.currency,
                })} AUD`,
                onClick: () => crud.onOpenRead(invoice.id),
              }))}
            />
          </Field>
        )}
      />
    </Spacer>
  )
}
