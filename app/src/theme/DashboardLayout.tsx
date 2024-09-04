import {css} from "@emotion/css"
import {FC} from "react"
import {Outlet} from "react-router-dom"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {prettyCns} from "../utils/classNames"
import {Center} from "./Center"
import {Container} from "./Container"
import {IconBar} from "./IconBar"
import {MainMenu} from "./MainMenu"
import {useMedia} from "./MediaProvider"

export const DashboardLayout: FC = () => {
  const media = useMedia()

  return (
    <Center>
      <div className={cn_dl.root}>
        {!media.isMobile() && (
          <Container>
            <MainMenu />
          </Container>
        )}
        <Container>
          <div className={cn_dl.body}>
            <Outlet />
          </div>
          {media.isMobile() && <IconBar />}
        </Container>
      </div>
    </Center>
  )
}

const cn_dl = prettyCns("DashboardLayout", {
  root: css`
    gap: 1rem;
    padding: 1rem;
    height: 40rem;
    max-height: 100vh;
    flex-direction: row;
    overflow: auto;
    @media (width < ${MEDIA_WIDTH_MOBILE}px) {
      gap: 0;
      padding: 0;
      height: 100%;
      max-height: 100%;
      flex-direction: column;
      flex-grow: 1;
    }
  `,
  body: css`
    flex-grow: 1;
    overflow: auto;
  `,
})
