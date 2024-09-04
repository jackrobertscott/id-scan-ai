import {css} from "@emotion/css"
import {mdiClose, mdiContentSave, mdiPlus} from "@mdi/js"
import {Fragment, useState} from "react"
import {prettyCns} from "../utils/classNames"
import {Button} from "./Button"
import {Icon} from "./Icon"
import {Modal} from "./Modal"
import {Poster, PosterProps} from "./Poster"
import {Spacer} from "./Spacer"

export const updatePageOptions = (
  onClose: () => void,
  hasChanged?: boolean
): TitleBarOption[] => {
  return [
    {
      icon: mdiClose,
      label: hasChanged ? "Cancel" : "Close",
      onClick: onClose,
      intercept: hasChanged
        ? {
            icon: mdiContentSave,
            // variant: "yellow",
            title: "Are you sure?",
            description: "You have unsaved changes",
            buttonLabel: "Leave without saving",
          }
        : undefined,
    },
  ]
}

export const createPageOptions = (onClose: () => void): TitleBarOption[] => {
  return [
    {
      icon: mdiClose,
      label: "Cancel",
      onClick: onClose,
    },
  ]
}

export const listCreateOption = (onClick: () => void) => {
  return {
    icon: mdiPlus,
    label: "New",
    onClick: onClick,
  }
}

export type TitleBarOption = {
  icon: string
  label?: string
  onClick: () => void
  intercept?: PosterProps & {buttonLabel: string}
}

export type TitleBarProps = {
  title: string
  options?: Array<false | undefined | null | TitleBarOption>
}

export const TitleBar = ({title, options = []}: TitleBarProps) => {
  const [intercept, setIntercept] = useState<
    TitleBarOption["intercept"] & {onClick: () => void}
  >()
  return (
    <Fragment>
      {intercept && (
        <Modal width="15rem">
          <Spacer>
            <Poster {...intercept} />
            <Button label={intercept.buttonLabel} onClick={intercept.onClick} />
            <Button label="Cancel" onClick={() => setIntercept(undefined)} />
          </Spacer>
        </Modal>
      )}

      <div className={cn_tb.root}>
        <div className={cn_tb.title}>{title}</div>
        {options.length > 0 && (
          <div className={cn_tb.options}>
            {options.map((option, i) => {
              if (!option) return null
              return (
                <div
                  key={i}
                  className={cn_tb.option}
                  onClick={() => {
                    if (option.intercept)
                      setIntercept({
                        ...option.intercept,
                        onClick: option.onClick,
                      })
                    else option.onClick()
                  }}>
                  {option.label && <div>{option.label}</div>}
                  <Icon icon={option.icon} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Fragment>
  )
}

const cn_tb = prettyCns("TitleBar", {
  root: css`
    padding: 0 0.25rem;
    flex-direction: row;
    color: hsl(0, 0%, 100%, 0.5);
  `,
  title: css`
    flex-grow: 1;
    color: hsl(0, 0%, 100%, 0.75);
    padding: var(--padding-small);
  `,
  options: css`
    flex-direction: row;
    gap: var(--gap-regular);
  `,
  option: css`
    user-select: none;
    flex-direction: row;
    gap: var(--gap-regular);
    padding: var(--padding-small);
    transition: var(--hover-timing);
    border-radius: var(--radius-regular);
    :hover:not(:active) {
      color: hsl(0, 0%, 100%);
      background-color: hsl(0, 0%, 100%, 0.1);
    }
  `,
})
