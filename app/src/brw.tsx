import {createRoot} from "react-dom/client"

import "./global.css"

const app = <div style={{color: "white"}}>Hello, World!</div>

createRoot(document.getElementById("root")!).render(app)
