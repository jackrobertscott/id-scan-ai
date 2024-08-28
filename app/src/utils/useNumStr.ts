import {useCallback, useEffect, useState} from "react"
import {MergeObjects} from "./sharedTypes"

export type UseNumStrProps<T extends {}> = MergeObjects<
  T,
  {
    value?: number | null
    onValue?: (value: number | null) => void
    decimals?: number
    min?: number
    max?: number
  }
>

export function useNumStr<T extends {}>({
  value,
  onValue,
  decimals,
  min,
  max,
  ...rest
}: UseNumStrProps<T>) {
  const [stringValue, setStringValue] = useState<string | null>(() => {
    return value !== null && value !== undefined
      ? decimals !== undefined
        ? value.toFixed(decimals)
        : value.toString()
      : null
  })

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const newStringValue =
        decimals !== undefined ? value.toFixed(decimals) : value.toString()
      if (newStringValue !== stringValue) {
        setStringValue(newStringValue)
      }
    } else if (value === null && stringValue !== null) {
      setStringValue(null)
    }
  }, [value, decimals])

  const isValidNumberString = (str: string): boolean => {
    if (decimals !== undefined)
      return new RegExp(`^-?\\d*\\.?\\d{0,${decimals}}$`).test(str)
    return /^-?\d*\.?\d*$/.test(str)
  }

  const handleValueChange = useCallback(
    (newValue: string | null) => {
      if (newValue !== null && isValidNumberString(newValue)) {
        const parsedValue = parseFloat(newValue)
        if (!isNaN(parsedValue)) {
          let clampedValue = parsedValue
          if (min !== undefined) {
            clampedValue = Math.max(clampedValue, min)
          }
          if (max !== undefined) {
            clampedValue = Math.min(clampedValue, max)
          }
          const formattedValue =
            decimals !== undefined
              ? clampedValue.toFixed(decimals)
              : clampedValue.toString()
          setStringValue(formattedValue)
          onValue?.(clampedValue)
        } else {
          setStringValue(newValue)
          onValue?.(null)
        }
      } else if (newValue === null) {
        setStringValue(null)
        onValue?.(null)
      }
    },
    [onValue, decimals]
  )

  return {
    ...rest,
    value: stringValue,
    onValue: handleValueChange,
  }
}
