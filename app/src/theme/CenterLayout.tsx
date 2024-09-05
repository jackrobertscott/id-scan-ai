import {Outlet} from "react-router-dom"
import {Center} from "./Center"
import {Container} from "./Container"

export type CenterLayoutProps = {
  width?: string
}

export const CenterLayout = ({width}: CenterLayoutProps) => {
  return (
    <Center>
      <Container width={width}>
        <Outlet />
      </Container>
    </Center>
  )
}
