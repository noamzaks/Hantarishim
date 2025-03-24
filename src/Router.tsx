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
import { useCourseLoading } from "./models"
import { Loader } from "@mantine/core"
import SelectedPage from "./pages/SelectedPage"
import GroupsPage from "./pages/GroupsPage"
import GroupPage from "./pages/GroupPage"
import FormsPage from "./pages/FormsPage"
import FormPage from "./pages/FormPage"

const CourseLoader = () => {
  const loading = useCourseLoading()

  return (
    <>
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Loader size="sm" ml={5} />
          <span>טוען את המידע העדכני...</span>
        </div>
      )}
    </>
  )
}

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
      <CourseLoader />
      <Routes>
        <Route path="/" element={<Navigate to="/people" />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/people/group" element={<SelectedPage />} />
        <Route path="/people/:name" element={<PersonPage />} />
        <Route
          path="/people/:attribute/:value"
          element={<FilteredPeoplePage />}
        />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/assignments/:assignment" element={<AssignmentPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:group" element={<GroupPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/forms/:form" element={<FormPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </CourseProvider>
  )
}

export default Router
