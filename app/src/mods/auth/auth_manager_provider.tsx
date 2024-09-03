import {mdiLogin} from "@mdi/js"
import {FC, ReactNode, useEffect, useRef, useState} from "react"
import {useNavigate} from "react-router-dom"
import {
  TIMING_DEVICE_CLIENT_CHECK,
  TIMING_DEVICE_MAX_SESSION_CLIENT,
} from "../../consts/TIMING"
import {Button} from "../../theme/Button"
import {Modal} from "../../theme/Modal"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {StatusCodeError} from "../../utils/server/errorClasses"
import {fetchEdge} from "../../utils/server/fetchEdge.brw"
import {useLocalState} from "../../utils/useLocalState"
import {AuthManagerContext, AuthPayloadType} from "./auth_manager"
import {auth_eDef} from "./auth_eDef.iso"

export const AuthManagerProvider: FC<{
  children: ReactNode
}> = ({children}) => {
  const navigate = useNavigate()
  const [reAuthWarn, setReAuthWarn] = useState(false)
  const [lastTimeStamp, setLastTimeStamp] = useState(() => Date.now())
  const [_pl, _setPl] = useLocalState<AuthPayloadType | null>("auth", null)
  const payloadRef = useRef(_pl)

  const setPayload = (payload: AuthPayloadType | null) => {
    payloadRef.current = payload
    _setPl(payload)
    setLastTimeStamp(Date.now())
  }

  const refresh = async () => {
    if (!payloadRef.current?.token) return
    fetchEdge({def: auth_eDef.get, token: payloadRef.current.token})
      .then(({payload}) => setPayload(payload ?? null))
      .catch((error) => {
        if (error instanceof StatusCodeError && error.statusCode === 401) {
          console.warn("Unauthorized (401)")
          setPayload(null)
        }
      })
  }

  // Load payload from server on first render
  useEffect(() => {
    refresh()
  }, [])

  // Check for session expiry on devices
  useEffect(() => {
    const data = payloadRef.current?.data
    if (!data || !data.deviceId) return
    const interval = setInterval(() => {
      if (location.pathname.includes("login")) return
      const timeElapsed = Date.now() - data.sessionCreatedDate.valueOf()
      if (timeElapsed > TIMING_DEVICE_MAX_SESSION_CLIENT) setReAuthWarn(true)
    }, TIMING_DEVICE_CLIENT_CHECK) // 60 seconds
    return () => clearInterval(interval)
  }, [_pl])

  return (
    <AuthManagerContext.Provider
      value={{
        lastTimeStamp,
        getPayload: () => payloadRef.current,
        setPayload,
        refresh,
      }}>
      {children}
      {reAuthWarn && (
        <Modal>
          <Spacer>
            <Poster
              icon={mdiLogin}
              title="Session Expiry Warning"
              description="Please re-authenticate to continue using the application"
            />
            <Button
              label="Login"
              // variant="blue"
              onClick={() => {
                navigate("/login-face")
                setReAuthWarn(false)
              }}
            />
            <Button
              label="Ignore"
              // variant="grey"
              onClick={() => setReAuthWarn(false)}
            />
          </Spacer>
        </Modal>
      )}
    </AuthManagerContext.Provider>
  )
}
