import { TextInput, ActionIcon, Button } from "@mantine/core"
import { useState } from "react"
import FontAwesome from "../components/FontAwesome"
import LinkAnchor from "../components/LinkAnchor"
import { getLocalStorage } from "../lib/utilities"
import { getAttributes, useCourse } from "../models"

const pad = (s: string, c: number) => s.padStart(c, "0")

const SelectedPage = () => {
  const [absenceReason, setAbsenceReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingIncrement, setLoadingIncrement] = useState(false)
  const [course, setCourse, updateCourse] = useCourse()

  const names: string[] = getLocalStorage("Selected", [])

  return (
    <>
      <h1>עריכת מסומנים</h1>
      {names.map((name, nameIndex) => (
        <LinkAnchor href={`/people/${name}`} key={nameIndex} ml="xs" mb="xs">
          {name}
        </LinkAnchor>
      ))}
      <TextInput
        maw="300"
        label="סיבת היעדרות"
        value={absenceReason}
        onChange={(e) => setAbsenceReason(e.currentTarget.value)}
        mb="xs"
        rightSection={
          <ActionIcon
            loading={loading}
            onClick={() => {
              const updates: Record<string, string> = {}
              for (const name of names) {
                updates[`people.${name}.absenceReason`] = absenceReason
              }
              updateCourse(updates, setLoading)
            }}
          >
            <FontAwesome icon="floppy-disk" />
          </ActionIcon>
        }
      />
      {getAttributes(course)
        .filter((attribute) => course.attributes![attribute].isNumber)
        .map((attribute, attributeIndex) => (
          <Button
            ml={5}
            mb={5}
            key={attributeIndex}
            leftSection={<FontAwesome icon="wand-magic-sparkles" />}
            loading={loadingIncrement}
            onClick={() => {
              for (const name of names) {
                course.people![name].attributes[attribute] = pad(
                  (
                    parseInt(course.people![name].attributes[attribute], 10) + 1
                  ).toString(),
                  3,
                )
              }
              setCourse({ ...course }, setLoadingIncrement)
            }}
          >
            הוספת 1 ל{attribute}
          </Button>
        ))}
    </>
  )
}

export default SelectedPage
