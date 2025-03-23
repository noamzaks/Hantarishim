import { useParams } from "react-router-dom"
import { useCourse } from "../models"
import LinkButton from "../components/LinkButton"
import FontAwesome from "../components/FontAwesome"

const GroupPage = () => {
  const [course] = useCourse()
  const params = useParams()
  const name = params.group!

  return (
    <>
      <h1>{name}</h1>
      {(course.groups ?? {})[name]?.map((person, personIndex) => (
        <LinkButton
          my={5}
          ml={5}
          key={personIndex}
          href={`/people/${person}`}
          leftSection={<FontAwesome icon="user" />}
        >
          {person}
        </LinkButton>
      ))}
    </>
  )
}

export default GroupPage
