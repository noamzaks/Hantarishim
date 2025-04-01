import { Switch } from "@mantine/core"
import AddAssignment from "../components/AddAssignment"
import LinkButton from "../components/LinkButton"
import { useLocalStorage } from "../lib/hooks"
import { useCourse } from "../models"

const AssignmentsPage = () => {
  const [course] = useCourse()
  const [filterAttribute] = useLocalStorage<string | null>({
    key: "Filter Attribute",
    defaultValue: null,
  })
  const [filterValue] = useLocalStorage<string | undefined>({
    key: "Filter Value",
    defaultValue: undefined,
  })
  const [filterAssignments, setFilterAssignments] = useLocalStorage<boolean>({
    key: "Filter Assignments",
    defaultValue: true,
  })

  let assignments = course.assignments ?? []
  if (filterAttribute && filterValue && filterAssignments) {
    assignments = assignments.filter(
      (assignment) =>
        Object.keys(course.people ?? {})
          .filter(
            assignment.kind === "person"
              ? (personName) => assignment.targets.includes(personName)
              : assignment.kind === "attribute"
                ? (personName) =>
                    assignment.targets.includes(
                      course.people![personName].attributes[
                        assignment.attribute!
                      ],
                    )
                : (personName) =>
                    assignment.targets.some((target) =>
                      (course.groups ?? {})[target]?.includes(personName),
                    ),
          )
          .filter(
            (person) =>
              course.people![person].attributes[filterAttribute] ===
              filterValue,
          ).length !== 0,
    )
  }

  return (
    <>
      <h1>מטלות</h1>
      <Switch
        label="הצג רק מטלות אחרי פלטור"
        checked={filterAssignments}
        onChange={(e) => setFilterAssignments(e.currentTarget.checked)}
        mb="xs"
      />
      {assignments.map((assignment, assignmentIndex) => (
        <LinkButton
          mb={5}
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
