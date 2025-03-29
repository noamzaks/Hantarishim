import { DirectionProvider, MantineProvider } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import { BrowserRouter } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Router from "./Router"
import { Notifications } from "@mantine/notifications"
import { ModalsProvider } from "@mantine/modals"

const App = () => {
  const colorScheme = useColorScheme()

  return (
    <BrowserRouter>
      <DirectionProvider>
        <MantineProvider
          forceColorScheme={colorScheme}
          theme={{ fontFamily: "IBM Plex Sans Hebrew" }}
        >
          <ModalsProvider>
            <Notifications />

            <Header
              links={[
                { url: "/people", title: "אנשים", icon: "user-group" },
                { url: "/groups", title: "קבוצות", icon: "users" },
                { url: "/assignments", title: "מטלות", icon: "file-lines" },
                { url: "/forms", title: "סקרים", icon: "highlighter" },
                { url: "/settings", title: "הגדרות", icon: "gear" },
              ]}
            />
            <main
              style={{
                flexGrow: 1,
                overflow: "auto",
                paddingRight: 10,
                paddingLeft: 10,
                paddingBottom: 20,
              }}
            >
              <Router />
            </main>
            <Footer />
          </ModalsProvider>
        </MantineProvider>
      </DirectionProvider>
    </BrowserRouter>
  )
}

export default App
