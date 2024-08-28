// css
import "./global.css"
// ...rest
import {createRoot} from "react-dom/client"
import {AuthEmail} from "./mods/auth/auth_email_cmp"

const app = <AuthEmail />

createRoot(document.getElementById("root")!).render(app)
