import {
  Autocomplete,
  Button,
  Fieldset,
  Select,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core"
import { Assignment, getAttributes, useCourse } from "../models"
import FontAwesome from "./FontAwesome"
import { useEffect, useState } from "react"

const AddAssignment = () => {
  const [course, updateCourse] = useCourse()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [due, setDue] = useState("")
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

  const hasAssignment = course.assignments?.some(
    (assignment) => assignment.name === name,
  )

  useEffect(() => {
    if (hasAssignment) {
      const assignment = course.assignments!.find(
        (assignment) => assignment.name === name,
      )!
      setDescription(assignment.description)
      setDue(assignment.due)
      setKind(assignment.kind)
      setTargets(assignment.targets)
      setAttribute(assignment.attribute ?? "")
    } else if (name === "") {
      setDescription("")
      setDue("")
      setKind("attribute")
      setTargets([])
      setAttribute("")
    }
  }, [name])

  return (
    <Fieldset legend="הוספת/עריכת מטלה">
      <Autocomplete
        label="שם"
        value={name}
        onChange={setName}
        data={course.assignments?.map((assignment) => assignment.name) ?? []}
      />
      <Textarea
        mt="xs"
        label="תיאור"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />
      <TextInput
        mt="xs"
        leftSection={<FontAwesome icon="calendar" />}
        label="תאריך הגשה"
        value={due}
        onChange={(e) => setDue(e.currentTarget.value)}
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
          hasAssignment ? (
            <FontAwesome icon="pen" />
          ) : (
            <FontAwesome icon="plus" />
          )
        }
        loading={loading}
        onClick={() => {
          if (!course.assignments) {
            course.assignments = []
          }

          const assignment: Assignment = {
            kind,
            targets,
            name: name.trim(),
            description,
            due,
            attribute,
          }

          const assignmentIndex = course.assignments.findIndex(
            (s) => s.name === name,
          )
          if (assignmentIndex !== -1) {
            course.assignments[assignmentIndex] = assignment
          } else {
            course.assignments.push(assignment)
          }

          updateCourse({ assignments: course.assignments }, setLoading)?.then(
            () => setName(""),
          )
        }}
      >
        {hasAssignment ? "עריכה" : "הוספה"}
      </Button>
      {hasAssignment && (
        <Button
          mt="xs"
          fullWidth
          leftSection={<FontAwesome icon="trash" />}
          color="red"
          onClick={() => {
            course.assignments = course.assignments?.filter(
              (assignment) => assignment.name !== name,
            )
            updateCourse({ assignments: course.assignments }, setLoading)?.then(
              () => setName(""),
            )
          }}
        >
          מחיקה
        </Button>
      )}
    </Fieldset>
  )
}

export default AddAssignment
