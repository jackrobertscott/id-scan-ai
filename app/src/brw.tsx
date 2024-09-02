// css
import "./global.css"
// ...rest
import {createRoot} from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import {AlertManagerProvider} from "./mods/alert/alert_manager_provider"
import {AuthManagerProvider} from "./mods/auth/auth_manager_provider"
import {DeviceManagerProvider} from "./mods/device/device_manager"
import {MediaProvider} from "./theme/MediaProvider"
import {formatZodErrors} from "./utils/formatZodErrors"
import {Root} from "./mods/root/Root"

formatZodErrors()

const app = (
  <BrowserRouter>
    <MediaProvider>
      <AlertManagerProvider>
        <DeviceManagerProvider>
          <AuthManagerProvider>
            <Root />
          </AuthManagerProvider>
        </DeviceManagerProvider>
      </AlertManagerProvider>
    </MediaProvider>
  </BrowserRouter>
)

createRoot(document.getElementById("root")!).render(app)
