import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./firebase"
import { useEffect } from "react"
import Login from "./components/Login"
import SettingsPage from "./pages/SettingsPage"
import PeoplePage from "./pages/PeoplePage"
import CourseProvider from "./components/CourseProvider"
import FilteredPeoplePage from "./pages/FilteredPeoplePage"
import PersonPage from "./pages/PersonPage"
import AssignmentsPage from "./pages/AssignmentsPage"
import AssignmentPage from "./pages/AssignmentPage"

const Router = () => {
  const [currentUser, loading] = useAuthState(auth)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !currentUser && location.pathname !== "/login") {
      navigate("/login")
    }

    if (!loading && currentUser && location.pathname === "/login") {
      navigate("/")
    }
  }, [currentUser, loading, location.pathname])

  if (loading || !currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    )
  }

  return (
    <CourseProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/people" />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/people/:name" element={<PersonPage />} />
        <Route
          path="/people/:attribute/:value"
          element={<FilteredPeoplePage />}
        />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/assignments/:assignment" element={<AssignmentPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </CourseProvider>
  )
}

export default Router
