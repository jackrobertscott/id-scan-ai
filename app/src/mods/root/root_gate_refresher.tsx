import {useEffect, useRef, useState} from "react"
import {Outlet, useLocation} from "react-router-dom"

export type RefresherGateProps = {
  timeout?: number
}

export const RefresherGate = ({
  timeout = 15 * 60 * 1e3, // 15 minutes
}: RefresherGateProps) => {
  const browserLocation = useLocation()
  const [currentHref, setCurrentHref] = useState(() => location.href)
  const lastChangeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (lastChangeRef.current + timeout < Date.now()) {
      location.reload()
    } else {
      lastChangeRef.current = Date.now()
      setCurrentHref(location.href)
    }
  }, [browserLocation])

  return location.href === currentHref ? <Outlet /> : null
}
