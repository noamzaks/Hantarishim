import {
  Autocomplete,
  Button,
  Fieldset,
  Select,
  TagsInput,
} from "@mantine/core"
import { Form, getAttributes, useCourse } from "../models"
import FontAwesome from "./FontAwesome"
import { useEffect, useState } from "react"

const AddForm = () => {
  const [course, updateCourse] = useCourse()
  const [name, setName] = useState("")
  const [kind, setKind] = useState<"person" | "attribute" | "group">(
    "attribute",
  )
  const [attribute, setAttribute] = useState("")
  const [targets, setTargets] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  let targetOptions: string[] = []

  if (kind === "person") {
    targetOptions = Object.keys(course.people ?? {}).sort()
  } else if (kind === "attribute") {
    const set = new Set<string>()
    for (const person of Object.values(course.people ?? {})) {
      if (person.attributes[attribute]) {
        set.add(person.attributes[attribute])
      }
    }
    targetOptions = [...set]
  } else if (kind === "group") {
    targetOptions = Object.keys(course.groups ?? {}).sort()
  }

  const hasForm = course.forms?.some((form) => form.name === name)

  useEffect(() => {
    if (hasForm) {
      const form = course.forms!.find((form) => form.name === name)!
      setKind(form.kind)
      setTargets(form.targets)
      setAttribute(form.attribute ?? "")
    } else if (name === "") {
      setKind("attribute")
      setTargets([])
      setAttribute("")
    }
  }, [name])

  return (
    <Fieldset legend="הוספת/עריכת סקר">
      <Autocomplete
        label="שם"
        value={name}
        onChange={setName}
        data={course.forms?.map((form) => form.name) ?? []}
      />
      <Select
        mt="xs"
        label="סוג היעד"
        data={[
          { label: "שם", value: "person" },
          { label: "קבוצה", value: "group" },
          { label: "מאפיין", value: "attribute" },
        ]}
        value={kind}
        onChange={(v) =>
          setKind((v ?? "attribute") as "person" | "attribute" | "group")
        }
      />
      {kind === "attribute" && (
        <Autocomplete
          mt="xs"
          label="מאפיין"
          data={getAttributes(course)}
          value={attribute}
          onChange={setAttribute}
        />
      )}
      <TagsInput
        mt="xs"
        label="יעדים"
        value={targets}
        onChange={(t) => setTargets(t.filter((x) => targetOptions.includes(x)))}
        data={targetOptions}
      />
      <Button
        mt="xs"
        fullWidth
        leftSection={
          hasForm ? <FontAwesome icon="pen" /> : <FontAwesome icon="plus" />
        }
        loading={loading}
        onClick={() => {
          if (!course.forms) {
            course.forms = []
          }

          const form: Form = {
            kind,
            targets,
            name,
            attribute,
          }

          const formIndex = course.forms.findIndex((s) => s.name === name)
          if (formIndex !== -1) {
            course.forms[formIndex] = form
          } else {
            course.forms.push(form)
          }

          updateCourse({ forms: course.forms }, setLoading)?.then(() =>
            setName(""),
          )
        }}
      >
        {hasForm ? "עריכה" : "הוספה"}
      </Button>
      {hasForm && (
        <Button
          mt="xs"
          fullWidth
          leftSection={<FontAwesome icon="trash" />}
          color="red"
          onClick={() => {
            course.forms = course.forms?.filter((form) => form.name !== name)
            updateCourse({ forms: course.forms }, setLoading)?.then(() =>
              setName(""),
            )
          }}
        >
          מחיקה
        </Button>
      )}
    </Fieldset>
  )
}

export default AddForm
