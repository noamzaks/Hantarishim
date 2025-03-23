import AddGroup from "../components/AddGroup"
import LinkButton from "../components/LinkButton"
import { useCourse } from "../models"

const GroupsPage = () => {
  const [course] = useCourse()

  return (
    <>
      <h1>קבוצות</h1>
      {Object.keys(course.groups ?? {})
        .sort()
        .map((group, groupIndex) => (
          <LinkButton
            href={`/groups/${group}`}
            key={groupIndex}
            ml="xs"
            mb="xs"
          >
            {group}
          </LinkButton>
        ))}
      <AddGroup />
    </>
  )
}

export default GroupsPage
