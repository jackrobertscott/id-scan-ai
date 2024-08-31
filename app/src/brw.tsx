// css
import "./global.css"
// ...rest
import {createRoot} from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import {AlertManagerProvider} from "./mods/alert/AlertManagerProvider"
import {AuthManagerProvider} from "./mods/auth/AuthManagerProvider"
import {DeviceManagerProvider} from "./mods/device/device_manager"
import {Root} from "./mods/root/Root"
import {MediaProvider} from "./theme/MediaProvider"
import {formatZodErrors} from "./utils/formatZodErrors"

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
