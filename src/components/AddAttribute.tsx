import {
  Fieldset,
  TextInput,
  Checkbox,
  Button,
  Autocomplete,
  ColorInput,
  MultiSelect,
  Select,
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
  const [defaultSort, setDefaultSort] = useState("")
  const [priority, setPriority] = useState("")
  const [derivativeAttributes, setDerivativeAttributes] = useState<string[]>([])
  const [filterable, setFilterable] = useState(true)
  const [quickDeletable, setQuickDeletable] = useState(false)
  const [isButton, setIsButton] = useState(false)
  const [isLocation, setIsLocation] = useState(false)
  const [isNumber, setIsNumber] = useState(false)
  const [loading, setLoading] = useState(false)

  const hasName = course.attributes && course.attributes[name] !== undefined
  const attributes = getAttributes(course)

  useEffect(() => {
    if (course.attributes && course.attributes[name]) {
      setIcon(course.attributes[name].icon ?? "")
      setPriority(course.attributes[name].priority?.toString() ?? "")
      setFilterable(course.attributes[name].filterable ?? false)
      setQuickDeletable(course.attributes[name].quickDeletable ?? false)
      setIsLocation(course.attributes[name].isLocation ?? false)
      setIsNumber(course.attributes[name].isNumber ?? false)
      setColor(course.attributes[name].color ?? "")
      setIsButton(course.attributes[name].isButton ?? false)
      setDerivativeAttributes(
        course.attributes[name].derivativeAttributes ?? [],
      )
      setDefaultSort(course.attributes[name].defaultSort ?? "")
    } else if (name === "") {
      setIcon("")
      setPriority("")
      setFilterable(true)
      setQuickDeletable(false)
      setIsLocation(false)
      setIsNumber(false)
      setColor("")
      setIsButton(false)
      setDerivativeAttributes([])
      setDefaultSort("")
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
      <Select
        mt="xs"
        label="מיון דיפולטי"
        value={defaultSort}
        onChange={(v) => setDefaultSort(v ?? "")}
        data={attributes.filter((x) => x !== name)}
      />
      <TextInput
        mt="xs"
        label="עדיפות (גבוה יותר מופיע יותר גבוה בדף)"
        type="number"
        value={priority}
        onChange={(e) => setPriority(e.currentTarget.value)}
      />
      <MultiSelect
        mt="xs"
        label="מאפיינים נגזרים (למשל מחלקה יכולה להיגזר מצוות)"
        data={attributes.filter((x) => x !== name)}
        value={derivativeAttributes}
        onChange={setDerivativeAttributes}
      />
      <Checkbox
        mt="xs"
        label="מספרי (לדוגמה מספר התנדבויות)"
        checked={isNumber}
        onChange={(e) => setIsNumber(e.currentTarget.checked)}
      />
      <Checkbox
        mt="xs"
        label="ניתן לסינון (לדוגמה צוות ולא תעודת זהות)"
        checked={filterable}
        onChange={(e) => setFilterable(e.currentTarget.checked)}
      />
      <Checkbox
        mt="xs"
        label="מחיק במהירות (בכל שורה בטבלה יופיע כפתור להסרת המאפיין)"
        checked={quickDeletable}
        onChange={(e) => setQuickDeletable(e.currentTarget.checked)}
      />
      <Checkbox
        mt="xs"
        label="קובע מיקום (לדוגמה אוטובוס)"
        checked={isLocation}
        onChange={(e) => setIsLocation(e.currentTarget.checked)}
      />
      <Checkbox
        mt="xs"
        label="מוצג ככפתור (לדוגמה טלפון)"
        checked={isButton}
        onChange={(e) => setIsButton(e.currentTarget.checked)}
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
            isLocation,
            filterable,
            quickDeletable,
            defaultSort,
            isNumber,
            isButton,
            derivativeAttributes,
          }
          setCourse(course, setLoading)?.then(() => setName(""))
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
            setCourse(course, setLoading, false)?.then(() => setName(""))
          }}
        >
          מחיקה
        </Button>
      )}
    </Fieldset>
  )
}

export default AddAttribute
