import {css} from "@emotion/css"
import {FC} from "react"
import {gcn} from "../gcn"
import {jn_cn, prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"

export type SimpleListOption = {
  key?: string
  label: string
  desc?: string
  icons?: Array<{
    icon: string
    onClick?: () => void
  }>
  onClick?: () => void
}

export type SimpleListProps = {
  maxHeight?: number
  options: Array<false | null | undefined | SimpleListOption>
}

export const SimpleList = ({maxHeight, options}: SimpleListProps) => {
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
    <div className={jn_cn(cn_li.root, gcn.elevate)}>
      <div
        className={cn_li.trigger}
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
        <div className={cn_li.body}>
          <div>{option.label}</div>
          {option.icons && option.icons.length > 0 && (
            <div className={cn_li.iconGroup}>
              {option.icons.map((icon, index) => (
                <div key={index} onClick={icon.onClick} className={cn_li.icon}>
                  <Icon icon={icon.icon} />
                </div>
              ))}
            </div>
          )}
        </div>
        {option.desc && <div className={cn_li.desc}>{option.desc}</div>}
      </div>
    </div>
  )
}

const cn_li = prettyCns("ListItem", {
  root: css`
    overflow: auto;
    flex-direction: row;
    flex-shrink: 0;
  `,
  trigger: css`
    flex-grow: 1;
    cursor: default;
    padding: var(--pad-r);
    &[data-can-click="true"] {
      user-select: none;
      transition: var(--hover-timing);
      &:hover:not(:active) {
        background-color: var(--lgt-clr);
      }
    }
  `,
  body: css`
    flex-direction: row;
    justify-content: space-between;
  `,
  iconGroup: css`
    flex-direction: row;
  `,
  icon: css`
    user-select: none;
    align-items: center;
    justify-content: center;
    color: var(--fnt-clr-2nd);
    width: calc(var(--line-height) * 1rem);
    height: calc(var(--line-height) * 1rem);
    transition: var(--hover-timing);
    &:hover:not(:active) {
      color: hsl(0, 0%, 100%);
    }
    & > * {
      pointer-events: none; // required for click to pass through
    }
  `,
  desc: css`
    color: var(--fnt-clr-3rd);
    font-size: var(--fnt-s);
  `,
})
