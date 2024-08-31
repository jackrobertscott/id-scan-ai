import {css} from "@emotion/css"
import {mdiCheck, mdiClose, mdiLoading} from "@mdi/js"
import {MutableRefObject} from "react"
import {createCns} from "../utils/classNames"
import {Icon} from "./Icon"
import {InputButton} from "./InputButton"
import {InputStatic} from "./InputStatic"
import {Popup, PopupContainer} from "./Popup"

export type InputSelectOption<T = string> = {
  value: T
  label?: string
}

export type InputSelectProps<R extends boolean, T = string> = {
  value?: T | null
  onValue?: (value: R extends true ? T : T | null) => void
  options: InputSelectOption<T>[]
  placeholder?: string
  minWidth?: string
  required?: R
}

export const InputSelect = <R extends boolean, T = string>({
  value,
  onValue,
  options,
  placeholder = "Select",
  minWidth = "15rem",
  required,
}: InputSelectProps<R, T>) => {
  const currentOption = options.find((i) => i.value === value)
  return (
    <Popup
      renderTrigger={(triggerRef, doShow) => (
        <InputSelectLabel<T>
          triggerRef={triggerRef}
          onClick={() => doShow()}
          placeholder={placeholder}
          onRemove={() => onValue?.(null as any)}
          currentOption={currentOption}
          required={required}
        />
      )}
      renderPopupContent={(doHide) => (
        <PopupContainer minWidth={minWidth}>
          {options.map((option) => (
            <InputSelectOption<R, T>
              key={String(option.value)}
              option={option}
              currentOption={currentOption}
              onValue={onValue}
              doHide={doHide}
            />
          ))}
        </PopupContainer>
      )}
    />
  )
}

export type InputSelectOptionProps<R extends boolean, T = string> = {
  option: InputSelectOption<T>
  currentOption?: InputSelectOption<T>
  onValue?: (value: R extends true ? T : T | null) => void
  doHide: () => void
}

export const InputSelectOption = <R extends boolean, T = string>({
  option,
  currentOption,
  onValue,
  doHide,
}: InputSelectOptionProps<R, T>) => {
  return (
    <div
      className={cn_iso.root}
      onClick={() => {
        onValue?.(option.value)
        doHide()
      }}>
      <div>{option.label ?? String(option.value)}</div>
      <div>
        {currentOption?.value === option.value && <Icon icon={mdiCheck} />}
      </div>
    </div>
  )
}

const cn_iso = createCns("InputSelectOption", {
  root: css`
    flex-shrink: 0;
    user-select: none;
    flex-direction: row;
    white-space: pre-line;
    justify-content: space-between;
    transition: var(--hover-timing);
    padding: var(--padding-regular);
    gap: var(--gap-regular);
    :not(:last-child) {
      border-bottom: var(--border-regular);
    }
    :hover:not(:active) {
      background-color: hsl(0, 0%, 100%, 0.05);
    }
  `,
})

export type InputSelectLabelProps<T = string> = {
  triggerRef?: MutableRefObject<HTMLDivElement>
  onClick?: () => void
  currentOption?: InputSelectOption<T>
  placeholder?: string
  onRemove?: () => void
  required?: boolean
  loading?: boolean
}

export const InputSelectLabel = <T = string,>({
  triggerRef,
  onClick,
  currentOption,
  placeholder,
  onRemove,
  required,
  loading,
}: InputSelectLabelProps<T>) => {
  return (
    <div className={cn_isl.root}>
      <div
        ref={triggerRef}
        onClick={onClick}
        className={cn_isl.trigger}
        style={{
          color: currentOption ? "hsl(0, 0%, 100%)" : "hsl(0, 0%, 100%, 0.25)",
        }}>
        {currentOption
          ? currentOption.label ?? String(currentOption.value)
          : placeholder}
      </div>
      {loading ? (
        <InputStatic>
          <Icon icon={mdiLoading} spinning />
        </InputStatic>
      ) : (
        !required &&
        currentOption && <InputButton icon={mdiClose} onClick={onRemove} />
      )}
    </div>
  )
}

const cn_isl = createCns("InputSelectLabel", {
  root: css`
    flex-grow: 1;
    flex-direction: row;
    overflow: auto;
  `,
  trigger: css`
    flex-grow: 1;
    cursor: default;
    overflow: hidden;
    user-select: none;
    white-space: pre-line;
    gap: var(--gap-regular);
    padding: var(--padding-regular);
    transition: var(--hover-timing);
    :hover:not(:active) {
      background-color: hsl(0, 0%, 100%, 0.05);
    }
  `,
})
