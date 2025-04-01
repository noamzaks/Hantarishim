import { DirectionProvider, MantineProvider } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import { BrowserRouter } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Router from "./Router"
import { Notifications } from "@mantine/notifications"
import { ModalsProvider } from "@mantine/modals"
import { ErrorBoundary } from "react-error-boundary"
import { DatesProvider } from "@mantine/dates"

const ErrorDisplay = ({ error }: { error: any }) => {
  return (
    <>
      <h1>אוי לא, הייתה שגיאה!</h1>
      <p>אנחנו מתנצלים.</p>
      <p>
        אתם יכולים לנסות לסגור ולפתוח את האפליקציה 3 פעמים ואז היא מתעדכנת וזה
        עשוי לפתור את השגיאה.
      </p>
      <p>
        תשלחו לנו צילום מסך בבקשה (או יותר טוב, תעתיקו את כל הטקסט היפה כאן
        למטה).
      </p>
      <pre dir="ltr" style={{ overflow: "auto" }}>
        <code>{error?.message + "\n" + error?.stack}</code>
      </pre>
    </>
  )
}

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
            <DatesProvider
              settings={{
                locale: "he",
                weekendDays: [5, 6],
                firstDayOfWeek: 0,
              }}
            >
              <Notifications />

              <Header
                links={[
                  { url: "/people", title: "אנשים", icon: "user-group" },
                  // { url: "/groups", title: "קבוצות", icon: "users" },
                  { url: "/assignments", title: "מטלות", icon: "file-lines" },
                  // { url: "/forms", title: "סקרים", icon: "highlighter" },
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
                <ErrorBoundary FallbackComponent={ErrorDisplay}>
                  <Router />
                </ErrorBoundary>
              </main>
              <Footer />
            </DatesProvider>
          </ModalsProvider>
        </MantineProvider>
      </DirectionProvider>
    </BrowserRouter>
  )
}

export default App
