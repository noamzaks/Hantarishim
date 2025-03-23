import { CourseContext, CourseLoadingContext } from "../models"
import { useDocument } from "../lib/hooks"
import { auth } from "../firebase"
import { emailToUsername } from "../lib/utilities"

const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: course, loading } = useDocument(
    `/users/${emailToUsername(auth.currentUser!.email!)}`,
  )

  return (
    <CourseContext.Provider value={course}>
      <CourseLoadingContext.Provider value={loading}>
        {children}
      </CourseLoadingContext.Provider>
    </CourseContext.Provider>
  )
}

export default CourseProvider
