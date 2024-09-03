import {FC} from "react"
import {Outlet} from "react-router-dom"
import {Center} from "./Center"
import {Container} from "./Container"

export const CenterLayout: FC = () => {
  return (
    <Center>
      <Container>
        <Outlet />
      </Container>
    </Center>
  )
}
