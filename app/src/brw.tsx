// css
import "./global.css"
// ...rest
import {createRoot} from "react-dom/client"
import {Root} from "./mods/root/Root"

const app = <Root />

createRoot(document.getElementById("root")!).render(app)
