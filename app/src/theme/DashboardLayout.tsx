import {css} from "@emotion/css"
import {FC} from "react"
import {Outlet} from "react-router-dom"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {MainMenu} from "../mods/root/root_mainMenu"
import {prettyCns} from "../utils/classNames"
import {Container} from "./Container"
import {IconBar} from "./IconBar"
import {useMedia} from "./MediaProvider"

export const DashboardLayout: FC = () => {
  const media = useMedia()

  return (
    <div className={cn_dl.root}>
      {!media.isMobile() && (
        <Container width="17rem" noShrink>
          <MainMenu />
        </Container>
      )}
      <Container fullWidth={true}>
        <div className={cn_dl.body}>
          <Outlet />
        </div>
        {media.isMobile() && <IconBar />}
      </Container>
    </div>
  )
}

const cn_dl = prettyCns("DashboardLayout", {
  root: css`
    gap: 1rem;
    padding: 1rem;
    flex-grow: 1;
    /* height: 40rem; */
    /* max-height: 100vh; */
    flex-direction: row;
    overflow: auto;
    @media (width < ${MEDIA_WIDTH_MOBILE}px) {
      gap: 0;
      padding: 0;
      height: 100%;
      max-height: 100%;
      flex-direction: column;
    }
  `,
  body: css`
    flex-grow: 1;
    overflow: auto;
  `,
})
