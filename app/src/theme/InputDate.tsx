import {css} from "@emotion/css"
import {mdiClose} from "@mdi/js"
import {FC, useEffect, useState} from "react"
import {DATETIME_DAYS, DATETIME_MONTHS} from "../consts/DATETIME"
import {toCapitalCase} from "../utils/changeCase"
import {prettyCns} from "../utils/classNames"
import {Button} from "./Button"
import {Field} from "./Field"
import {InputButton} from "./InputButton"
import {InputNumber} from "./InputNumber"
import {InputSelect} from "./InputSelect"
import {Popup, PopupContainer} from "./Popup"
import {Spacer} from "./Spacer"

export const InputDate: FC<{
  value?: Date | null
  onValue?: (value: Date | null) => void
  includeTime?: boolean
  placeholder?: string
  required?: boolean
}> = ({
  value,
  onValue: _onValue,
  includeTime,
  placeholder = "Select",
  required,
}) => {
  const today = new Date()
  const currentDate = value ? new Date(value) : undefined
  const [contextDate, setContextDate] = useState(() => {
    return getStartOfDate(currentDate ? new Date(currentDate) : new Date())
  })

  function onValue(d: Date | null) {
    if (!_onValue) return
    d?.setSeconds(0)
    d?.setMilliseconds(0)
    if (d === null) _onValue(null)
    else if (includeTime) _onValue(d)
    else _onValue(getStartOfDate(d))
  }

  useEffect(() => {
    if (value) {
      const d = new Date(value)
      if (d.valueOf() !== currentDate?.valueOf()) onValue(d)
    } else {
      if (currentDate) onValue(null)
    }
  }, [value])

  return (
    <Popup
      renderTrigger={(triggerRef, doShow) => (
        <div className={cn_id.root}>
          <div
            ref={triggerRef}
            onClick={() => doShow()}
            className={cn_id.trigger}
            style={{
              color: currentDate
                ? "hsl(0, 0%, 100%)"
                : "hsl(0, 0%, 100%, 0.25)",
            }}>
            {currentDate
              ? formatSimpleDate(currentDate, includeTime)
              : placeholder}
          </div>

          {!required && currentDate && (
            <InputButton
              icon={mdiClose}
              onClick={() => onValue?.(null as any)}
            />
          )}
        </div>
      )}
      renderPopupContent={(doHide) => (
        <PopupContainer minWidth="20rem" maxHeight={null} bigRadius>
          <Spacer>
            <Spacer direction="row" nested>
              <Field grow label="Month">
                <InputSelect
                  value={contextDate.getMonth().toString()}
                  onValue={(i) => {
                    if (!i) return
                    const d = new Date(contextDate)
                    d.setMonth(+i)
                    setContextDate(d)
                  }}
                  options={DATETIME_MONTHS.map((month, index) => ({
                    value: index.toString(),
                    label: toCapitalCase(month),
                  }))}
                />
              </Field>

              <Field grow label="Year">
                <InputSelect
                  value={contextDate.getFullYear().toString()}
                  onValue={(i) => {
                    if (!i) return
                    const d = new Date(contextDate)
                    d.setFullYear(+i)
                    setContextDate(d)
                  }}
                  options={Array.from({length: 100}).map((_, index) => ({
                    value: (2030 - index).toString(),
                  }))}
                />
              </Field>
            </Spacer>

            <Field label="Day">
              <DayGrid
                contextDate={contextDate}
                currentDate={currentDate}
                today={today}
                onValue={onValue}
              />
            </Field>

            {includeTime && (
              <Field label="Time">
                <InputNumber
                  min={1}
                  max={12}
                  placeholder="Hour"
                  value={(() => {
                    let i = currentDate ? currentDate.getHours() % 12 : null
                    if (i === 0) i = 12
                    return i
                  })()}
                  onValue={(i) => {
                    if (typeof i !== "number") return
                    const d = currentDate ? new Date(currentDate) : new Date()
                    let j = +i
                    if (j === 12) j = 0
                    if (d.getHours() >= 12) j += 12
                    d.setHours(j)
                    onValue(d)
                  }}
                />

                <InputNumber
                  min={0}
                  max={59}
                  placeholder="Min"
                  value={currentDate?.getMinutes()}
                  onValue={(i) => {
                    if (typeof i !== "number") return
                    const d = currentDate ? new Date(currentDate) : new Date()
                    d.setMinutes(+i)
                    onValue(d)
                  }}
                />

                <InputSelect
                  options={[{value: "am"}, {value: "pm"}]}
                  value={
                    currentDate
                      ? currentDate.getHours() >= 12
                        ? "pm"
                        : "am"
                      : null
                  }
                  onValue={(i) => {
                    if (!i) return
                    const d = currentDate ? new Date(currentDate) : new Date()
                    let h = d.getHours() % 12
                    if (i === "pm") h += 12
                    d.setHours(h)
                    onValue(d)
                  }}
                />
              </Field>
            )}

            <Button label="Done" onClick={() => doHide()} />
          </Spacer>
        </PopupContainer>
      )}
    />
  )
}

const cn_id = prettyCns("InputDate", {
  root: css`
    flex-grow: 1;
    flex-direction: row;
  `,
  trigger: css`
    flex-grow: 1;
    cursor: default;
    user-select: none;
    gap: var(--gap-r);
    padding: var(--pad-r);
    transition: var(--hover-timing);
    :hover:not(:active) {
      background-color: hsl(0, 0%, 100%, 0.05);
    }
  `,
})

const DayGrid: FC<{
  contextDate: Date
  currentDate?: Date
  today: Date
  onValue: (d: Date) => void
}> = ({contextDate, currentDate, today, onValue}) => {
  return (
    <div className={cn_dg.root}>
      {DATETIME_DAYS.map((day) => (
        <div key={day} className={cn_dg.dayName}>
          {toCapitalCase(day).slice(0, 2)}
        </div>
      ))}
      {Array.from({length: 6}).flatMap((_, indexWeek) => {
        const startOfWeek = new Date(contextDate)
        startOfWeek.setDate(1)
        startOfWeek.setDate(indexWeek * 7 + 1 - startOfWeek.getDay())
        return Array.from({length: 7}).map((__, indexDay) => {
          const day = new Date(startOfWeek)
          day.setDate(startOfWeek.getDate() + indexDay)
          const inMonth = day.getMonth() === contextDate.getMonth()
          const isCur =
            currentDate &&
            day.getFullYear() === currentDate.getFullYear() &&
            day.getMonth() === currentDate.getMonth() &&
            day.getDate() === currentDate.getDate()
          const isToday =
            day.getFullYear() === today.getFullYear() &&
            day.getMonth() === today.getMonth() &&
            day.getDate() === today.getDate()
          return (
            <DateCell
              key={[indexWeek, indexDay].join()}
              day={day}
              currentDate={currentDate}
              isToday={isToday}
              isCur={isCur}
              inMonth={inMonth}
              onValue={onValue}
            />
          )
        })
      })}
    </div>
  )
}

const cn_dg = prettyCns("DayGrid", {
  root: css`
    flex-grow: 1;
    display: grid;
    overflow: hidden;
    user-select: none;
    text-align: center;
    grid-template-columns: repeat(7, 1fr);
    gap: 1rem;
  `,
  dayName: css`
    padding: 10px;
    text-align: center;
    justify-content: center;
  `,
})

const DateCell: FC<{
  day: Date
  currentDate?: Date
  isToday: boolean
  isCur?: boolean
  inMonth: boolean
  onValue: (d: Date) => void
}> = ({day, currentDate, isToday, isCur, inMonth, onValue}) => {
  return (
    <div
      className={cn_dc.root}
      style={{
        color: isCur
          ? "white"
          : isToday
          ? "hsl(0, 100%, 50%)"
          : inMonth
          ? "hsl(0, 0%, 100%)"
          : "hsl(0, 0%, 100%, 0.25)",
        backgroundColor: isCur ? "hsl(270, 100%, 50%, 0.5)" : undefined,
      }}
      onClick={() => {
        const d = currentDate ? new Date(currentDate) : new Date()
        d.setFullYear(day.getFullYear())
        d.setMonth(day.getMonth())
        d.setDate(day.getDate())
        onValue(d)
      }}>
      {day.getDate()}
    </div>
  )
}

const cn_dc = prettyCns("DateCell", {
  root: css`
    user-select: none;
    text-align: center;
    justify-content: center;
    padding: var(--pad-r-y) 0;
    transition: var(--hover-timing);
    :hover:not(:active) {
      background-color: hsl(0, 0%, 100%, 0.05);
    }
  `,
})

const getStartOfDate = (d1: Date) => {
  const d2 = new Date(d1)
  d2.setHours(6)
  d2.setMinutes(0)
  d2.setSeconds(0)
  d2.setMilliseconds(0)
  return d2
}

const formatSimpleDate = (d?: Date, includeTime?: boolean) => {
  return d?.toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: includeTime ? "short" : undefined,
  })
}
