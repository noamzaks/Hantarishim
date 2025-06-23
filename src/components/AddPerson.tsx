import { Autocomplete, Button, Fieldset, TextInput } from "@mantine/core"
import { deleteField } from "firebase/firestore"
import { useEffect, useState } from "react"
import { getAttributes, useCourse } from "../models"
import FontAwesome, { FontAwesomeIcon } from "./FontAwesome"

const AddPerson = () => {
  const [course, updateCourse] = useCourse()
  const [name, setName] = useState("")
  const [attributes, setAttributes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const hasPerson = course.people && course.people[name] !== undefined

  useEffect(() => {
    if (hasPerson) {
      setAttributes({ ...course.people![name].attributes })
    } else if (name === "") {
      setAttributes({})
    }
  }, [name])

  return (
    <Fieldset legend="הוספת/עריכת אנשים">
      <Autocomplete
        label="שם"
        value={name}
        onChange={setName}
        data={Object.keys(course.people ?? {}).sort()}
      />

      {getAttributes(course).map((attribute, attributeIndex) => {
        return (
          <TextInput
            key={attributeIndex}
            label={attribute}
            mt="xs"
            value={attributes[attribute] ?? ""}
            type={
              course.attributes![attribute].kind === "number"
                ? "number"
                : undefined
            }
            onChange={(e) => {
              const newAttributes = {
                ...attributes,
                [attribute]: e.currentTarget.value,
              }
              for (const derivativeAttribute of course.attributes![attribute]
                .derivativeAttributes ?? []) {
                let found = false
                for (const person of Object.values(course.people ?? {})) {
                  if (
                    person.attributes[attribute] === e.currentTarget.value &&
                    person.attributes[derivativeAttribute]
                  ) {
                    newAttributes[derivativeAttribute] =
                      person.attributes[derivativeAttribute]
                    found = true
                    break
                  }
                }
                if (!found) {
                  delete newAttributes[derivativeAttribute]
                }
              }
              setAttributes(newAttributes)
            }}
            leftSection={
              course.attributes![attribute].icon ? (
                <FontAwesome
                  icon={course.attributes![attribute].icon! as FontAwesomeIcon}
                />
              ) : undefined
            }
          />
        )
      })}

      <Button
        mt="xs"
        fullWidth
        leftSection={
          hasPerson ? <FontAwesome icon="pen" /> : <FontAwesome icon="plus" />
        }
        loading={loading}
        onClick={() => {
          updateCourse(
            {
              [`people.${name}`]: {
                attributes,
                present: false,
                submitted: [],
              },
            },
            setLoading,
          )?.then(() => {
            setName("")
            setAttributes({})
          })
        }}
      >
        {hasPerson ? "עריכה" : "הוספה"}
      </Button>
      {hasPerson && (
        <Button
          mt="xs"
          fullWidth
          leftSection={<FontAwesome icon="trash" />}
          color="red"
          onClick={() => {
            delete course.people![name]
            updateCourse(
              { [`people.${name}`]: deleteField() },
              setLoading,
            )?.then(() => {
              setName("")
              setAttributes({})
            })
          }}
        >
          מחיקה
        </Button>
      )}
    </Fieldset>
  )
}

export default AddPerson
