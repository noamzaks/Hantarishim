import { useEffect, useState } from "react"
import { useCourse } from "../models"
import { Autocomplete, Button, Fieldset, TagsInput } from "@mantine/core"
import FontAwesome from "./FontAwesome"

const AddGroup = () => {
  const [course, setCourse] = useCourse()
  const [name, setName] = useState("")
  const [people, setPeople] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const hasGroup =
    course.groups !== undefined && course.groups[name] !== undefined

  useEffect(() => {
    if (hasGroup) {
      setPeople([...course.groups![name]])
    } else if (name === "") {
      setPeople([])
    }
  }, [name])

  return (
    <Fieldset legend="הוספת/עריכת קבוצה">
      <Autocomplete
        label="שם"
        value={name}
        onChange={setName}
        data={Object.keys(course.groups ?? {}).sort()}
      />
      <TagsInput
        mt="xs"
        label="אנשים"
        value={people}
        onChange={(t) =>
          setPeople(t.filter((x) => (course.people ?? {})[x] !== undefined))
        }
        data={Object.keys(course.people ?? {}).sort()}
      />
      <Button
        mt="xs"
        fullWidth
        leftSection={
          hasGroup ? <FontAwesome icon="pen" /> : <FontAwesome icon="plus" />
        }
        loading={loading}
        onClick={() => {
          if (!course.groups) {
            course.groups = {}
          }
          course.groups[name] = people
          setCourse(course, setLoading)?.then(() => {
            setName("")
          })
        }}
      >
        {hasGroup ? "עריכה" : "הוספה"}
      </Button>
      {hasGroup && (
        <Button
          mt="xs"
          fullWidth
          leftSection={<FontAwesome icon="trash" />}
          color="red"
          onClick={() => {
            delete course.groups![name]
            setCourse(course, setLoading, false)?.then(() => setName(""))
          }}
        >
          מחיקה
        </Button>
      )}
    </Fieldset>
  )
}

export default AddGroup
