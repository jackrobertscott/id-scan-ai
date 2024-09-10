import {mdiClose} from "@mdi/js"
import {Fragment} from "react/jsx-runtime"
import {Button} from "../../theme/Button"
import {Field} from "../../theme/Field"
import {InputStatic} from "../../theme/InputStatic"
import {LoadingScreen} from "../../theme/LoadingScreen"
import {Modal} from "../../theme/Modal"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"
import {downloadPdf} from "../../utils/downloadUtils"
import {useEdge} from "../../utils/server/useEdge"
import {inv_byMbr_eDef} from "./inv_byMbr_eDef.iso"

export type ReadInvoiceByMemberViewProps = {
  invoiceId: string
  onClose: () => void
}

export const ReadInvoiceByMemberView = ({
  invoiceId,
  onClose,
}: ReadInvoiceByMemberViewProps) => {
  const $getEdge = useEdge(inv_byMbr_eDef.get, {
    pushValue: {invoiceId},
    fetchOnMount: true,
  })

  return (
    <Modal size="small">
      <Spacer>
        <TitleBar
          title="Invoice"
          options={[{icon: mdiClose, label: "Close", onClick: () => onClose()}]}
        />

        <LoadingScreen
          data={$getEdge.output}
          render={({invoice}) => (
            <Fragment>
              {invoice.invoicePdf && (
                <Button
                  bgColor="var(--bg-blu)"
                  label="Download PDF"
                  onClick={() => {
                    if (!invoice.invoicePdf) return
                    downloadPdf(invoice.invoicePdf, "invoice.pdf")
                  }}
                />
              )}

              <Field label="Created Date">
                <InputStatic
                  label={invoice.createdDate.toLocaleString("en-au", {
                    dateStyle: "medium",
                  })}
                />
              </Field>

              <Field label="Total">
                <InputStatic
                  label={(invoice.amountDue / 100).toLocaleString("en-au", {
                    style: "currency",
                    currency: invoice.currency,
                  })}
                />
              </Field>

              <Field label="Paid">
                <InputStatic
                  label={(invoice.amountPaid / 100).toLocaleString("en-au", {
                    style: "currency",
                    currency: invoice.currency,
                  })}
                />
              </Field>

              <Field label="Remaining">
                <InputStatic
                  label={(invoice.amountRemaining / 100).toLocaleString(
                    "en-au",
                    {
                      style: "currency",
                      currency: invoice.currency,
                    }
                  )}
                />
              </Field>

              <Field label="Customer Name">
                <InputStatic label={invoice.customerName || "..."} />
              </Field>

              <Field label="Customer Email">
                <InputStatic label={invoice.customerEmail || "..."} />
              </Field>
            </Fragment>
          )}
        />
      </Spacer>
    </Modal>
  )
}
