import {css} from "@emotion/css"
import {FC} from "react"
import {gcn} from "../gcn"
import {jn_cn, prettyCns} from "../utils/classNames"
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
  return (
    <div style={{maxHeight}} className={cn_sl.root}>
      {options.map((option, index) => {
        if (!option) return null
        return <ListItem key={option.key ?? index} option={option} />
      })}
    </div>
  )
}

const cn_sl = prettyCns("SimpleList", {
  root: css`
    flex-grow: 1;
    flex-shrink: 0;
    max-width: 100%;
    overflow: auto;
  `,
})

const ListItem: FC<{
  option: SimpleListOption
}> = ({option}) => {
  return (
    <div className={jn_cn(cn.root, gcn.elevate)}>
      <div
        className={cn.trigger}
        data-can-click={!!option.onClick}
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

const cn = prettyCns("ListItem", {
  root: css`
    flex-shrink: 0;
    overflow: auto;
    flex-direction: row;
  `,
  trigger: css`
    flex-grow: 1;
    cursor: default;
    padding: var(--pad-r);
    &[data-can-click="true"] {
      user-select: none;
      transition: var(--hover-timing);
      :hover:not(:active) {
        background-color: hsl(0, 0%, 100%, 0.05);
      }
    }
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
    font-size: var(--font-s);
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
    font-size: var(--font-s);
  `,
})
