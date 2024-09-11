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
import {gcn} from "../gcn"
import {MainMenu} from "../mods/root/root_mainMenu"
import {prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"
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
        <Modal size="small">
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
      <div className={cn_ibo.label}>{label}</div>
    </div>
  )
}

const cn_ibo = prettyCns("IconBarOption", {
  root: css`
    ${gcn.elevate}
    flex-grow: 1;
    flex-basis: 0;
    cursor: default;
    user-select: none;
    text-align: center;
    justify-content: center;
    align-items: center;
    gap: var(--gap-r);
    color: var(--fnt-clr-2nd);
    padding: var(--pad-r-y) 0;
    font-size: var(--fnt-s);
    &:hover:not(:active) {
      color: var(--bg-fnt);
      background-color: var(--lgt-clr);
    }
  `,
  label: css`
    padding-bottom: env(safe-area-inset-bottom);
  `,
})
