import {css} from "@emotion/css"
import {FC} from "react"
import {useCnStatic} from "../utils/classNames"
import {Icon} from "./Icon"

export type SimpleListOptionAction = {
  icon: string
  onClick: () => void
}

export type SimpleListOption = {
  key?: string
  icon?: string
  label: string
  description?: string
  onClick?: () => void
  actions?: SimpleListOptionAction[]
}

export const SimpleList: FC<{
  maxHeight?: number
  options: Array<false | null | undefined | SimpleListOption>
}> = ({maxHeight, options}) => {
  const cn = useCnStatic("simple-list", () => ({
    root: css`
      flex-grow: 1;
      flex-shrink: 0;
      max-width: 100%;
      overflow: auto;
      & > *:not(:last-child) {
        border-bottom: var(--border-regular);
      }
    `,
  }))

  return (
    <div style={{maxHeight}} className={cn.root}>
      {options.map((option, index) => {
        if (!option) return null
        return <ListItem key={option.key ?? index} option={option} />
      })}
    </div>
  )
}

const ListItem: FC<{
  option: SimpleListOption
}> = ({option}) => {
  const cn = useCnStatic("list-item", () => ({
    root: css`
      flex-shrink: 0;
      overflow: auto;
      flex-direction: row;
    `,
    trigger: css`
      flex-grow: 1;
      cursor: default;
      padding: var(--padding-regular);
      ${option.onClick &&
      css`
        user-select: none;
        transition: var(--hover-timing);
        :hover:not(:active) {
          background-color: hsl(0, 0%, 100%, 0.05);
        }
      `}
    `,
    body: css`
      flex-direction: row;
      justify-content: space-between;
    `,
    actions: css`
      flex-direction: row;
    `,
    action: css`
      user-select: none;
      align-items: center;
      justify-content: center;
      color: hsl(0, 0%, 100%, 0.5);
      width: calc(var(--line-height) * 1rem);
      height: calc(var(--line-height) * 1rem);
      border-radius: var(--radius-regular);
      font-size: var(--font-size-small);
      transition: var(--hover-timing);
      :hover:not(:active) {
        color: hsl(0, 0%, 100%);
        background-color: hsl(0, 0%, 100%, 0.1);
      }
      > * {
        pointer-events: none; // required for click to pass through
      }
    `,
    description: css`
      color: hsl(0, 0%, 100%, 0.5);
      font-size: var(--font-size-small);
    `,
  }))

  return (
    <div className={cn.root}>
      <div
        className={cn.trigger}
        onClick={({target}) => {
          if (
            target instanceof HTMLElement &&
            target.classList.contains("list-item-action")
          ) {
            return
          }
          option.onClick?.()
        }}>
        <div className={cn.body}>
          <div>{option.label}</div>
          {option.icon && <Icon icon={option.icon} />}
          {option.actions && option.actions.length > 0 && (
            <div className={cn.actions}>
              {option.actions.map((action, index) => (
                <div key={index} onClick={action.onClick} className={cn.action}>
                  <Icon icon={action.icon} />
                </div>
              ))}
            </div>
          )}
        </div>
        {option.description && (
          <div className={cn.description}>{option.description}</div>
        )}
      </div>
    </div>
  )
}
