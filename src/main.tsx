import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/dropzone/styles.css"
import "@fortawesome/fontawesome-free/css/all.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
