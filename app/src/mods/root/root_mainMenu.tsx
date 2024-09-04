import {
  mdiAccountCog,
  mdiAccountGroup,
  mdiAccountLock,
  mdiCalendar,
  mdiCamera,
  mdiChartBar,
  mdiCog,
  mdiCreditCard,
  mdiDevices,
  mdiEmoticonHappy,
  mdiFilePdfBox,
  mdiHistory,
  mdiInvoiceText,
  mdiListBox,
  mdiPower,
  mdiShare,
  mdiStorefront,
  mdiSync,
  mdiTag,
  mdiViewGallery,
} from "@mdi/js"
import {FC} from "react"
import {useNavigate} from "react-router-dom"
import {Button} from "../../theme/Button"
import {Field} from "../../theme/Field"
import {QuestionModal} from "../../theme/QuestionModal"
import {SimpleList} from "../../theme/SimpleList"
import {Spacer} from "../../theme/Spacer"
import {TitleBar, TitleBarOption} from "../../theme/TitleBar"
import {useEdge} from "../../utils/server/useEdge"
import {auth_eDef} from "../auth/auth_eDef.iso"
import {useAuthManager} from "../auth/auth_manager"

export const MainMenu: FC<{
  onSelect?: () => void
  titleBarOptions?: TitleBarOption[]
}> = ({onSelect, titleBarOptions}) => {
  const navigate = useNavigate()
  const authManager = useAuthManager(true)
  const hasUser = !!authManager.getPayload()?.data.userId
  const hasVenue = !!authManager.getPayload()?.data.venueId
  const isDevice = !!authManager.getPayload()?.data.deviceId
  const isAdmin = !!authManager.getPayload()?.data.isAdmin

  const formatRoute = <T extends {icon: string; path: string}>(
    i: T | false
  ) => {
    if (typeof i === "object") {
      return {
        ...i,
        icons: [{icon: i.icon}],
        onClick: () => {
          navigate(i.path)
          onSelect?.()
        },
      }
    } else {
      return i
    }
  }

  if (!hasUser) {
    return null
  }

  return (
    <Spacer>
      <TitleBar title="Menu" options={titleBarOptions} />
      {hasVenue && (
        <Field label="Scanning">
          <SimpleList
            options={[
              {
                icon: mdiCamera,
                label: "New Scan",
                path: "/new-scan",
                desc: "Scan a new patron",
              },
              {
                icon: mdiHistory,
                label: "Scan History",
                path: "/scan-history",
              },
              {
                icon: mdiTag,
                label: "Tagged Patrons",
                path: "/tagged-patrons",
              },
              {
                icon: mdiEmoticonHappy,
                label: "Find By Face",
                path: "/find-by-face",
              },
            ].map(formatRoute)}
          />
        </Field>
      )}
      {hasVenue && !isDevice && (
        <Field label="Management">
          <SimpleList
            options={[
              {
                icon: mdiChartBar,
                label: "Overview",
                path: "/venue-stats",
              },
              {
                icon: mdiAccountGroup,
                label: "Members",
                path: "/venue-members",
              },
              {
                icon: mdiDevices,
                label: "Devices",
                path: "/venue-devices",
              },
              {
                icon: mdiFilePdfBox,
                label: "PDF Exports",
                path: "/pdf-exports",
              },
              {
                icon: mdiShare,
                label: "Shared Albums",
                path: "/shared-albums",
              },
              {
                icon: mdiListBox,
                label: "Event History",
                path: "/event-history",
              },
            ].map(formatRoute)}
          />
        </Field>
      )}
      {hasVenue && !isDevice && (
        <Field label="Payments">
          <SimpleList
            options={[
              {
                icon: mdiInvoiceText,
                label: "Invoices",
                path: "/invoices",
              },
              {
                icon: mdiCreditCard,
                label: "Pay Cards",
                path: "/pay-cards",
              },
            ].map(formatRoute)}
          />
        </Field>
      )}
      {!isDevice && (
        <Field label="Personal">
          <SimpleList
            options={[
              {
                icon: mdiAccountCog,
                label: "My Account",
                path: "/my-account",
              },
              {
                icon: mdiCalendar,
                label: "My Sessions",
                path: "/my-sessions",
              },
              {
                icon: mdiViewGallery,
                label: "My Albums",
                path: "/my-albums",
              },
              hasVenue && {
                icon: mdiCog,
                label: "Venue Settings",
                path: "/venue-settings",
              },
              {
                icon: mdiSync,
                label: "Switch Venue",
                path: "/select-venue",
              },
            ].map(formatRoute)}
          />
        </Field>
      )}
      {isAdmin && (
        <Field label="Admin">
          <SimpleList
            options={[
              {
                icon: mdiAccountLock,
                label: "All Users",
                path: "/all-users",
              },
              {
                icon: mdiStorefront,
                label: "All Venues",
                path: "/all-venues",
              },
            ].map(formatRoute)}
          />
        </Field>
      )}
      <LogoutButton />
    </Spacer>
  )
}

export type LogoutButtonProps = {}

export const LogoutButton = ({}: LogoutButtonProps) => {
  const authManager = useAuthManager()
  const $logout = useEdge(auth_eDef.logout)

  return (
    <QuestionModal
      poster={{
        icon: mdiPower,
        title: "Logout",
        description: "Are you sure you want to logout of your account?",
      }}
      render={(doShow) => <Button label="Logout" onClick={doShow} />}
      getButtons={(doClose) => [
        {
          label: "Logout",
          ...$logout.getSubmitProps(() => {
            authManager.setPayload(null)
            doClose()
          }),
        },
        {
          label: "Cancel",
          onClick: doClose,
        },
      ]}
    />
  )
}
