import {css} from "@emotion/css"
import {isValidElement, ReactNode} from "react"
import {prettyCns} from "../utils/classNames"

export type PdfTableProps = {
  nested?: boolean
  headings?: PdfTableHeadProps[]
  footings?: PdfTableFootProps[]
  rows?: PdfTableRowProps[]
}

export const PdfTable = ({nested, headings, footings, rows}: PdfTableProps) => {
  return (
    <div className={cn_pt.root}>
      <table className={cn_pt.table}>
        {headings && (
          <thead>
            <tr>
              {headings.map((heading, index) => (
                <PdfTableHead {...heading} key={index} />
              ))}
            </tr>
          </thead>
        )}
        {rows && (
          <tbody>
            {rows?.map((row) => (
              <PdfTableRow {...row} key={row.key} nested={nested} />
            ))}
          </tbody>
        )}
        {footings && (
          <tfoot>
            <tr>
              {footings.map((footing, index) => (
                <PdfTableFoot {...footing} key={index} />
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

const cn_pt = prettyCns("PdfTable", {
  root: css``,
  table: css`
    flex-shrink: 0;
  `,
})

export type PdfTableHeadProps = {
  label: string
}

const PdfTableHead = ({label}: PdfTableHeadProps) => {
  return (
    <th className={cn_pth.root}>
      <div className={cn_pth.label}>{label}</div>
    </th>
  )
}

const cn_pth = prettyCns("PdfTableHead", {
  root: css`
    border-bottom: var(--border-pdf);
    :not(:last-child) {
      border-right: var(--border-pdf);
    }
  `,
  label: css`
    flex-direction: row;
    justify-content: space-between;
    padding: var(--padding-small);
    gap: var(--gap-small);
  `,
})

export type PdfTableRowProps = {
  key: string
  columns: Array<{children?: ReactNode}>
  nested?: boolean
}

const PdfTableRow = ({columns, nested}: PdfTableRowProps) => {
  return (
    <tr className={cn_ptr.root}>
      {columns.map((column, index) => (
        <td key={index} className={cn_ptr.data}>
          {isValidElement(column.children) ? (
            column.children
          ) : (
            <div className={cn_ptr.text}>{column.children}</div>
          )}
        </td>
      ))}
    </tr>
  )
}

const cn_ptr = prettyCns("PdfTableRow", {
  root: css`
    page-break-inside: avoid;
    :nth-child(2n) {
      background-color: hsl(0, 0%, 0%, 0.1);
    }
    :not(:last-child) > td {
      border-bottom: var(--border-pdf);
    }
  `,
  data: css`
    vertical-align: top;
    color: var(--font-color-secondary);
    :not(:last-child) {
      border-right: var(--border-pdf);
    }
  `,
  text: css`
    white-space: pre-line;
    flex-direction: row;
    padding: var(--padding-small);
    gap: var(--gap-small);
    white-space: pre-line;
  `,
})

export type PdfTableFootProps = {
  label: string
}

const PdfTableFoot = ({label}: PdfTableFootProps) => {
  return (
    <td className={cn_ptf.root}>
      <div className={cn_ptf.label}>{label}</div>
    </td>
  )
}

const cn_ptf = prettyCns("PdfTableFoot", {
  root: css`
    border-top: var(--border-pdf);
    :not(:last-child) {
      border-right: var(--border-pdf);
    }
  `,
  label: css`
    flex-direction: row;
    padding: var(--padding-small);
    gap: var(--gap-small);
  `,
})
