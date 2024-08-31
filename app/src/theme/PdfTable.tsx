import {css} from "@emotion/css"
import {isValidElement, ReactNode} from "react"
import {useCn} from "../utils/classNames"

export type PdfTableProps = {
  nested?: boolean
  headings?: PdfTableHeadProps[]
  footings?: PdfTableFootProps[]
  rows?: PdfTableRowProps[]
}

export const PdfTable = ({nested, headings, footings, rows}: PdfTableProps) => {
  const cn = useCn("pdf-table", {
    root: css`
      border: ${nested ? undefined : "var(--border-pdf)"};
    `,
    table: css`
      flex-shrink: 0;
    `,
  })

  return (
    <div className={cn.root}>
      <table className={cn.table}>
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

export type PdfTableHeadProps = {
  label: string
}

const PdfTableHead = ({label}: PdfTableHeadProps) => {
  const cn = useCn("pdf-table-head", {
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

  return (
    <th className={cn.root}>
      <div className={cn.label}>{label}</div>
    </th>
  )
}

export type PdfTableRowProps = {
  key: string
  columns: Array<{children?: ReactNode}>
  nested?: boolean
}

const PdfTableRow = ({columns, nested}: PdfTableRowProps) => {
  const cn = useCn("pdf-table-row", {
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

  return (
    <tr className={cn.root}>
      {columns.map((column, index) => (
        <td key={index} className={cn.data}>
          {isValidElement(column.children) ? (
            column.children
          ) : (
            <div className={cn.text}>{column.children}</div>
          )}
        </td>
      ))}
    </tr>
  )
}

export type PdfTableFootProps = {
  label: string
}

const PdfTableFoot = ({label}: PdfTableFootProps) => {
  const cn = useCn("pdf-table-foot", {
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

  return (
    <td className={cn.root}>
      <div className={cn.label}>{label}</div>
    </td>
  )
}
