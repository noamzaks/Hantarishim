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
import { Attribute, getAttributes, useCourse } from "../models"
import FontAwesome from "./FontAwesome"
import IconPicker from "./IconPicker"
import { deleteField } from "firebase/firestore"

const AddAttribute = () => {
  const [course, updateCourse] = useCourse()
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
  const [loading, setLoading] = useState(false)
  const [kind, setKind] = useState("string")

  const hasName = course.attributes && course.attributes[name] !== undefined
  const attributes = getAttributes(course)

  useEffect(() => {
    if (course.attributes && course.attributes[name]) {
      setIcon(course.attributes[name].icon ?? "")
      setPriority(course.attributes[name].priority?.toString() ?? "")
      setFilterable(course.attributes[name].filterable ?? false)
      setQuickDeletable(course.attributes[name].quickDeletable ?? false)
      setIsLocation(course.attributes[name].isLocation ?? false)
      setKind(course.attributes[name].kind ?? "string")
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
      setKind("string")
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
      <Select
        label="סוג הפרמטר"
        value={kind}
        onChange={(v) => setKind(v ?? "string")}
        data={[
          { value: "string", label: "טקסט" },
          { value: "number", label: "מספר" },
          { value: "boolean", label: "כן/לא" },
        ]}
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
          updateCourse(
            {
              [`attributes.${name}`]: {
                icon,
                color,
                priority: parseInt(priority, 10),
                isLocation,
                filterable,
                quickDeletable,
                defaultSort,
                isButton,
                derivativeAttributes,
                kind,
              } as Attribute,
            },
            setLoading,
          )?.then(() => setName(""))
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
            updateCourse(
              { [`attributes.${name}`]: deleteField() },
              setLoading,
            )?.then(() => setName(""))
          }}
        >
          מחיקה
        </Button>
      )}
    </Fieldset>
  )
}

export default AddAttribute
