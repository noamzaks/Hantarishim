import { CourseContext } from "../models"
import { useDocument } from "../lib/hooks"
import { auth } from "../firebase"
import { emailToUsername } from "../lib/utilities"

const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: course } = useDocument(
    `/users/${emailToUsername(auth.currentUser!.email!)}`
  )

  return (
    <CourseContext.Provider value={course}>{children}</CourseContext.Provider>
  )
}

export default CourseProvider
