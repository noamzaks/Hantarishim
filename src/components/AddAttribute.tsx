import {
  Fieldset,
  TextInput,
  Checkbox,
  Button,
  Autocomplete,
  ColorInput,
} from "@mantine/core"
import { useEffect, useState } from "react"
import { getAttributes, useCourse } from "../models"
import FontAwesome from "./FontAwesome"
import IconPicker from "./IconPicker"

const AddAttribute = () => {
  const [course, setCourse] = useCourse()
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [color, setColor] = useState("")
  const [priority, setPriority] = useState("")
  const [filterable, setFilterable] = useState(true)
  const [loading, setLoading] = useState(false)

  const hasName = course.attributes && course.attributes[name] !== undefined

  useEffect(() => {
    if (course.attributes && course.attributes[name]) {
      setIcon(course.attributes[name].icon ?? "")
      setPriority(course.attributes[name].priority?.toString() ?? "")
      setFilterable(course.attributes[name].filterable ?? false)
      setColor(course.attributes[name].color ?? "")
    } else if (name === "") {
      setIcon("")
      setPriority("")
      setFilterable(true)
      setColor("")
    }
  }, [name])

  return (
    <Fieldset legend="הוספת/עריכת מאפיין">
      <Autocomplete
        label="שם"
        value={name}
        onChange={setName}
        data={getAttributes(course)}
      />
      <IconPicker icon={icon} setIcon={setIcon} mt="xs" />
      <ColorInput
        leftSection={
          <div
            style={{
              width: "70%",
              height: "70%",
              borderRadius: "100%",
              backgroundColor: color,
            }}
          />
        }
        mt="xs"
        label="צבע"
        value={color}
        onChange={setColor}
      />
      <TextInput
        mt="xs"
        label="עדיפות (גבוה יותר מופיע יותר גבוה בדף)"
        type="number"
        value={priority}
        onChange={(e) => setPriority(e.currentTarget.value)}
      />
      <Checkbox
        mt="xs"
        label="ניתן לסינון (לדוגמה פלוגה ולא תעודת זהות)"
        checked={filterable}
        onChange={(e) => setFilterable(e.currentTarget.checked)}
      />
      <Button
        mt="xs"
        fullWidth
        leftSection={
          hasName ? <FontAwesome icon="pen" /> : <FontAwesome icon="plus" />
        }
        loading={loading}
        onClick={() => {
          if (!course.attributes) {
            course.attributes = {}
          }
          course.attributes[name] = {
            icon,
            color,
            priority: parseInt(priority, 10),
            filterable,
          }
          setCourse(course, setLoading)?.then(() => {
            setName("")
            setIcon("")
            setPriority("")
            setFilterable(true)
            setColor("")
          })
        }}
      >
        {hasName ? "עריכה" : "הוספה"}
      </Button>
      {hasName && (
        <Button
          mt="xs"
          fullWidth
          leftSection={<FontAwesome icon="trash" />}
          color="red"
          onClick={() => {
            delete course.attributes![name]
            setCourse(course, setLoading, false)?.then(() => {
              setName("")
              setIcon("")
              setPriority("")
              setFilterable(true)
              setColor("")
            })
          }}
        >
          מחיקה
        </Button>
      )}
    </Fieldset>
  )
}

export default AddAttribute
