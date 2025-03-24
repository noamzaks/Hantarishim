import AddForm from "../components/AddForm"
import LinkButton from "../components/LinkButton"
import { useCourse } from "../models"

const FormsPage = () => {
  const [course] = useCourse()

  return (
    <>
      <h1>סקרים</h1>
      {course.forms?.map((form, formIndex) => (
        <LinkButton my={5} ml={5} href={`/forms/${form.name}`} key={formIndex}>
          {form.name}
        </LinkButton>
      ))}
      <AddForm />
    </>
  )
}

export default FormsPage
