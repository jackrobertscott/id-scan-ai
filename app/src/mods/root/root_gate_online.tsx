import {mdiSync, mdiWifi} from "@mdi/js"
import {FC, useEffect, useState} from "react"
import {Outlet} from "react-router-dom"
import {brwConf} from "../../brwConf"
import {TIMING_PING_DEV, TIMING_PING_PROD} from "../../consts/TIMING"
import {Button} from "../../theme/Button"
import {Center} from "../../theme/Center"
import {Container} from "../../theme/Container"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {useEdge} from "../../utils/server/useEdge"
import {root_eDef} from "./root_eDef.iso"

export const OnlineGate: FC = () => {
  const $ping = useEdge(root_eDef.ping)
  const [ok, setOk] = useState(true)
  const [ready, setReady] = useState(false)

  function testConnection() {
    const time = Date.now()
    $ping
      .fetch({time})
      .then(() => !ok && setOk(true))
      .catch(() => ok && setOk(false))
      .finally(() => !ready && setReady(true)) // set ready on first load
  }

  useEffect(() => {
    testConnection()
    const timeout = brwConf.IS_PROD ? TIMING_PING_PROD : TIMING_PING_DEV
    const i = setInterval(() => testConnection(), timeout) // every 15 seconds
    return () => clearInterval(i)
  }, [])

  // if not ready, show nothing
  if (!ready) return null

  // if ok, show children
  if (ok) return <Outlet />

  // if not ok, show offline gate
  return (
    <Center>
      <Container>
        <Spacer>
          <Poster
            icon={mdiWifi}
            title="No Connection"
            description="Please check your internet connection and try again."
          />
          <Button
            icon={mdiSync}
            label="Retry"
            onClick={() => testConnection()}
          />
        </Spacer>
      </Container>
    </Center>
  )
}
