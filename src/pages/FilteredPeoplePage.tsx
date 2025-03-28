import { useNavigate, useParams } from "react-router-dom"
import { getAttributes, useCourse } from "../models"
import {
  ActionIcon,
  Alert,
  Autocomplete,
  Button,
  Fieldset,
  Loader,
  Switch,
  TextInput,
  Tooltip,
} from "@mantine/core"
import FontAwesome from "../components/FontAwesome"
import { useEffect, useState } from "react"
import DataTable from "../components/DataTable"
import React from "react"
import LinkAnchor from "../components/LinkAnchor"
import Clock from "../components/Clock"
import {
  getLocalStorage,
  setLocalStorage,
  showError,
  showSuccess,
} from "../lib/utilities"
import { useLocalStorage } from "../lib/hooks"
import AbsenceEditor from "../components/AbsenceEditor"
import { deleteField } from "firebase/firestore"

const ATTENDANCE_ID = "attendance"

const FilteredPeoplePage = () => {
  const [resettingPresence, setResettingPresence] = useState(false)
  const [focusedView, setFocusedView] = useState(false)
  const [myLocation, setMyLocation] = useLocalStorage<string>({
    key: "My Location",
    defaultValue: "",
  })
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [addName, setAddName] = useState("")
  const [loadAddName, setLoadAddName] = useState(false)
  const [loading, setLoading] = useState(false)
  const [course, setCourse, updateCourse] = useCourse()
  const params = useParams()
  const navigate = useNavigate()

  const attribute = params.attribute!
  const attributeValue = params.value!
  const filteredNames = Object.keys(course.people ?? {})
    .filter(
      (personName) =>
        course.people![personName].attributes[attribute] === attributeValue,
    )
    .sort()

  const present = filteredNames.filter(
    (personName) => course.people![personName].present,
  ).length
  const attributes = getAttributes(course)

  const splitter = focusedView ? <br /> : "•"
  const personToAdd = (course.people ?? {})[addName]
  const hasPersonToAdd = filteredNames.includes(addName)

  useEffect(() => {
    const names: string[] = getLocalStorage("Selected", [])
    setSelectedRows(
      names.map((name) => filteredNames.indexOf(name)).filter((x) => x !== -1),
    )
  }, [])

  useEffect(() => {
    if (course.attributes![attribute].isLocation) {
      setMyLocation(`${attribute}: ${attributeValue}`)
    }
  }, [course, attribute, attributeValue])

  return (
    <div>
      <h1 style={{ display: "flex", alignItems: "center" }}>
        {attribute}: {attributeValue}
        <Button.Group style={{ display: "inline-flex" }} mr="xs">
          <Button
            size="xs"
            leftSection={
              focusedView ? (
                <FontAwesome icon="pen" />
              ) : (
                <FontAwesome icon="note-sticky" />
              )
            }
            onClick={() => setFocusedView((f) => !f)}
          >
            {focusedView ? "חזרה לעריכה" : "הצגת סיכום בלבד"}
          </Button>
          {focusedView && (
            <Button
              size="xs"
              leftSection={<FontAwesome icon="copy" />}
              onClick={() => {
                const content =
                  `נוכחות ${attribute}: ${attributeValue}\n` +
                  document.getElementById(ATTENDANCE_ID)!.innerText!
                navigator.clipboard
                  .writeText(content)
                  .then(() =>
                    showSuccess(
                      "הנוכחות הועתקה בהצלחה!",
                      "אפשר לשלוח אותה לכל מי שצריכ/ה.",
                    ),
                  )
                  .catch(() =>
                    showError(
                      "לא ניתן להעתיק את הנוכחות!",
                      "אולי יש בעיית הרשאות.",
                    ),
                  )
              }}
            >
              העתקה
            </Button>
          )}
        </Button.Group>
      </h1>
      <p
        style={{
          marginBottom: 5,
          fontSize: focusedView ? 22 : undefined,
          overflowX: "auto",
        }}
        id={ATTENDANCE_ID}
      >
        {focusedView && (
          <>
            <b>שעה:</b> <Clock />
            {splitter}
          </>
        )}
        <b>כאן:</b> {present} {splitter} <b>חסרים/חסרות:</b>{" "}
        {filteredNames.length - present}
        {splitter} <b>פירוט:</b>
        {focusedView ? <br /> : " "}
        <span style={{ whiteSpace: "pre" }}>
          {filteredNames
            .filter((personName) => !course.people![personName].present)
            .sort((a, b) => {
              const infoA = course.people![a]
              const infoB = course.people![b]
              return (infoB.absenceReason ?? "").localeCompare(
                infoA.absenceReason ?? "",
              )
            })
            .map((personName) => {
              const info = course.people![personName]
              if (info.absenceReason) {
                return `${personName} (${info.absenceReason})`
              }
              return personName
            })
            .join(focusedView ? "\n" : ", ")}
        </span>
      </p>
      {!focusedView && (
        <>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <Button.Group>
              <Button
                variant="default"
                loading={resettingPresence}
                leftSection={<FontAwesome icon="rotate-left" />}
                onClick={() => {
                  for (const name of filteredNames) {
                    course.people![name].present = false
                    course.people![name].location = ""
                  }
                  setCourse(course, setResettingPresence)
                }}
              >
                איפוס נוכחות
              </Button>
              {selectedRows.length !== 0 && (
                <>
                  <Button
                    variant="default"
                    leftSection={<FontAwesome icon="user-group" />}
                    onClick={() => {
                      setLocalStorage(
                        "Selected",
                        selectedRows.map((rowIndex) => filteredNames[rowIndex]),
                      )
                      navigate("/people/group")
                    }}
                  >
                    עריכת מסומנים
                  </Button>
                  <Button
                    variant="default"
                    leftSection={<FontAwesome icon="rotate-left" />}
                    onClick={() => {
                      setSelectedRows([])
                      setLocalStorage("Selected", [])
                    }}
                  >
                    איפוס מסומנים
                  </Button>
                </>
              )}
            </Button.Group>
            {loading && (
              <>
                <Loader size="sm" mx="xs" />
                <span>מעדכן את הנוכחות בשרת...</span>
              </>
            )}
          </div>
          <TextInput
            label="איפה אני?"
            mb="xs"
            leftSection={<FontAwesome icon="location-dot" />}
            value={myLocation}
            onChange={(e) => setMyLocation(e.currentTarget.value)}
          />
          <DataTable
            selectable={!course.attributes![attribute].quickDeletable}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            tableName="אנשים"
            data={{
              head: ["", "שם", "נוכחות", "סיבת היעדרות", "מיקום"].concat(
                attributes,
              ),
              body: filteredNames.map((personName) =>
                [
                  "",
                  personName,
                  course.people![personName].present ? "נוכח/ת" : "חסר/ה",
                  course.people![personName].absenceReason ?? "",
                  course.people![personName].location ?? "",
                ].concat(
                  attributes.map(
                    (attribute) =>
                      course.people![personName].attributes[attribute],
                  ),
                ),
              ),
            }}
            renderValue={(rowIndex, columnName, value) => {
              if (columnName === "") {
                return <Tooltip label={`הסרה מה${attribute}`} ><ActionIcon color="red"
                onClick={() => {
                  updateCourse(
                    {
                      [`people.${filteredNames[rowIndex]}.attributes.${attribute}`]:
                        deleteField(),
                    },
                    setLoading,
                  )
                }}
                loading={loading}
                ><FontAwesome icon="trash" /></ActionIcon></Tooltip>
              }

              if (columnName === "שם") {
                return (
                  <LinkAnchor
                    key={rowIndex}
                    href={`/people/${filteredNames[rowIndex]}`}
                  >
                    {filteredNames[rowIndex]}
                  </LinkAnchor>
                )
              }

              if (columnName === "נוכחות") {
                return (
                  <Switch
                  size="md"
                    offLabel="חסר/ה"
                    onLabel="נוכח/ת"
                    key={rowIndex}
                    checked={
                      course.people![filteredNames[rowIndex]].present ?? false
                    }
                    onChange={(e) => {
                      const updates: Record<string, any> = {
                        [`people.${filteredNames[rowIndex]}.present`]:
                          e.currentTarget.checked,
                      }
                      updates[`people.${filteredNames[rowIndex]}.location`] = e
                        .currentTarget.checked
                        ? myLocation
                        : ""
                      updateCourse(updates, setLoading)
                    }}
                  />
                )
              }

              if (columnName === "סיבת היעדרות") {
                return (
                  <AbsenceEditor
                    key={rowIndex}
                    defaultValue={value}
                    setValue={(v, setLoading) =>
                      updateCourse(
                        {
                          [`people.${filteredNames[rowIndex]}.absenceReason`]:
                            v,
                        },
                        setLoading,
                      )
                    }
                  />
                )
              }

              return <React.Fragment key={rowIndex}>{value}</React.Fragment>
            }}
          />
          <Fieldset legend="שיוך" mt="xs">
            <Autocomplete
              value={addName}
              onChange={setAddName}
              label="שם"
              data={Object.keys(course.people ?? {})
                .filter((name) => !filteredNames.includes(name) && name !== addName)
                .sort()}
            />

            <Button
              fullWidth
              mt="xs"
              color={hasPersonToAdd ? "red" : undefined}
              leftSection={
                hasPersonToAdd ? (
                  <FontAwesome icon="trash" />
                ) : (
                  <FontAwesome icon="plus" />
                )
              }
              disabled={personToAdd === undefined}
              onClick={() => {
                updateCourse(
                  {
                    [`people.${addName}.attributes.${attribute}`]:
                      hasPersonToAdd ? "" : attributeValue,
                  },
                  setLoadAddName,
                )
              }}
              loading={loadAddName}
            >
              {hasPersonToAdd ? "הסרה" : "הוספה"}
            </Button>
            {personToAdd !== undefined && (
              <Alert
                color="yellow"
                icon={<FontAwesome icon="circle-info" />}
                mt="xs"
              >
                {getAttributes(course).map((attributeName, attributeIndex) => (
                  <p key={attributeIndex}>
                    {attributeName}: {personToAdd.attributes[attributeName]}
                  </p>
                ))}
              </Alert>
            )}
          </Fieldset>
        </>
      )}
    </div>
  )
}

export default FilteredPeoplePage
