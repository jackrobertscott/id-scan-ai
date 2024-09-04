import {css} from "@emotion/css"
import {
  mdiCamera,
  mdiChartBar,
  mdiClose,
  mdiHistory,
  mdiMenu,
  mdiTag,
} from "@mdi/js"
import {Fragment, useState} from "react"
import {useNavigate} from "react-router-dom"
import {prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"
import {MainMenu} from "./MainMenu"
import {Modal} from "./Modal"

export type IconBarProps = {}

export const IconBar = ({}: IconBarProps) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <div className={cn_ib.root}>
        <IconBarOption
          icon={mdiChartBar}
          label="Stats"
          onClick={() => navigate("/venue-stats")}
        />
        <IconBarOption
          icon={mdiHistory}
          label="History"
          onClick={() => navigate("/scan-history")}
        />
        <IconBarOption
          icon={mdiCamera}
          label="Scan"
          onClick={() => navigate("/new-scan")}
        />
        <IconBarOption
          icon={mdiTag}
          label="Tags"
          onClick={() => navigate("/tagged-patrons")}
        />
        <IconBarOption
          icon={mdiMenu}
          label="Menu"
          onClick={() => setOpen(true)}
        />
      </div>
      {open && (
        <Modal>
          <MainMenu
            onSelect={() => setOpen(false)}
            titleBarOptions={[
              {icon: mdiClose, label: "Close", onClick: () => setOpen(false)},
            ]}
          />
        </Modal>
      )}
    </Fragment>
  )
}

const cn_ib = prettyCns("IconBar", {
  root: css`
    padding: 0.5rem;
    flex-direction: row;
  `,
})

export type IconBarOptionProps = {
  icon: string
  label: string
  onClick?: () => void
}

export const IconBarOption = ({icon, label, onClick}: IconBarOptionProps) => {
  return (
    <div onClick={onClick} className={cn_ibo.root}>
      <Icon icon={icon} />
      <div>{label}</div>
    </div>
  )
}

const cn_ibo = prettyCns("IconBarOption", {
  root: css`
    gap: 0.25rem;
    flex-grow: 1;
    flex-basis: 0;
    cursor: default;
    user-select: none;
    text-align: center;
    justify-content: center;
    align-items: center;
    color: hsl(0, 0%, 100%, 0.75);
    padding: var(--padding-small-y) 0;
    font-size: var(--font-size-small);
    :hover:not(:active) {
      color: hsl(0, 0%, 100%);
      background-color: hsl(0, 0%, 100%, 0.05);
    }
  `,
})
