import AddAssignment from "../components/AddAssignment"
import LinkButton from "../components/LinkButton"
import { useCourse } from "../models"

const AssignmentsPage = () => {
  const [course] = useCourse()

  return (
    <>
      <h1>מטלות</h1>
      {course.assignments?.map((assignment, assignmentIndex) => (
        <LinkButton
          my={5}
          ml={5}
          href={`/assignments/${assignment.name}`}
          key={assignmentIndex}
        >
          {assignment.name}
        </LinkButton>
      ))}
      <AddAssignment />
    </>
  )
}

export default AssignmentsPage
