import {useEffect} from "react"
import {useEdge} from "../../utils/server/useEdge"
import {root_eDef} from "./root_eDef.iso"

export type RootProps = {}

export const Root = ({}: RootProps) => {
  const $ping = useEdge(root_eDef.ping)
  useEffect(() => {
    $ping.fetch({time: Date.now()}).then(console.log)
  }, [])

  return <div>Hello World</div>
}
