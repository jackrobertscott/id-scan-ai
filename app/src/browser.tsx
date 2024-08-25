import {createRoot} from "react-dom/client"

// import "./styles/animation.css"
// import "./styles/global.css"

const app = <div style={{color: "white"}}>Hello, World!</div>

createRoot(document.getElementById("root")!).render(app)
