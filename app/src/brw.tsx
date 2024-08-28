import {createRoot} from "react-dom/client"

import "./global.css"
import {AuthEmail} from "./ui/auth/auth_email_cmp"

const app = <AuthEmail />

createRoot(document.getElementById("root")!).render(app)
