import {css} from "@emotion/css"
import {mdiClose} from "@mdi/js"
import {ReactNode, useState} from "react"
import {InputButton} from "../../components/InputButton"
import {InputStatic} from "../../components/InputStatic"
import {Portal} from "../../components/Portal"
import {getThemeColor, ThemeColorVariant} from "../../utils/getThemeColor"
import {fadeInAndDownAnimation} from "../../utils/keyframes"
import {createRandomString} from "../../utils/randomString"
import {createCns} from "../classNames"
import {Alert, AlertManagerContext} from "../contexts/AlertManagerContext"

export type AlertManagerProviderProps = {
  children: ReactNode
}

export const AlertManagerProvider = ({children}: AlertManagerProviderProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const createAlert = (
    message: string,
    variant: ThemeColorVariant = "grey"
  ) => {
    const id = createRandomString(10)
    setAlerts((i) => [...i, {id, message, variant}])
    setTimeout(() => closeAlert(id), 8 * 1e3)
  }

  const closeAlert = (id: string) => {
    setAlerts((i) => i.filter((alert) => alert.id !== id))
  }

  return (
    <AlertManagerContext.Provider
      value={{
        alerts: [],
        create: createAlert,
        close: closeAlert,
      }}>
      {children}
      <Portal>
        <div className={cn.root}>
          {alerts.map((alert) => {
            const bg = getThemeColor({variant: alert.variant})
            return (
              <div
                key={alert.id}
                className={cn.alert}
                style={{
                  "--bg-color": bg.regular,
                  "--border": bg.border,
                }}>
                <InputStatic label={alert.message} />
                <InputButton
                  icon={mdiClose}
                  onClick={() => closeAlert(alert.id)}
                />
              </div>
            )
          })}
        </div>
      </Portal>
    </AlertManagerContext.Provider>
  )
}

const cn = createCns("AlertManagerProvider", {
  root: css`
    gap: 0.5rem;
    right: 1rem;
    bottom: 1rem;
    width: 20rem;
    z-index: 1000;
    max-width: 100%;
    position: fixed;
    flex-direction: column-reverse;
    align-items: end;
  `,
  alert: css`
    display: flex;
    overflow: hidden;
    flex-direction: row;
    border: var(--border);
    background-color: var(--bg-color);
    border-radius: var(--radius-regular);
    box-shadow: 0 0 1rem 0 hsla(0, 0%, 0%, 0.25);
    animation: ${fadeInAndDownAnimation} 250ms ease-out;
  `,
})
