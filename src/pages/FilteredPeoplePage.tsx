import { useNavigate, useParams } from "react-router-dom"
import { getAttributes, getPeopleForAttribute, useCourse } from "../models"
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
import FontAwesome, { FontAwesomeIcon } from "../components/FontAwesome"
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
import { modals } from "@mantine/modals"
import { getUpdater } from "../utilities"

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
  const [course, updateCourse] = useCourse()
  const params = useParams()
  const navigate = useNavigate()

  const attribute = params.attribute!
  const attributeValue = params.value!
  const filteredNames = getPeopleForAttribute(course, attribute, attributeValue)

  const present = filteredNames.filter(
    (personName) => course.people![personName].present,
  ).length
  const attributes = getAttributes(course)
  const otherAttributes = attributes.filter(
    (a) =>
      a !== attribute &&
      !course.attributes![attribute].derivativeAttributes?.includes(a) &&
      !course.attributes![a].isButton,
  )

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
                  const updates: Record<string, any> = {}
                  for (const name of filteredNames) {
                    updates[`people.${name}.present`] = false
                    updates[`people.${name}.location`] = ""
                  }
                  updateCourse(updates, setResettingPresence)
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
            defaultSort={
              course.attributes![attribute].defaultSort
                ? otherAttributes.indexOf(
                    course.attributes![attribute].defaultSort,
                  ) !== -1
                  ? otherAttributes.indexOf(
                      course.attributes![attribute].defaultSort,
                    ) +
                    4 +
                    (course.attributes![attribute].quickDeletable ? 1 : 0)
                  : undefined
                : undefined
            }
            selectable={!course.attributes![attribute].quickDeletable}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            tableName="אנשים"
            data={{
              head: (course.attributes![attribute].quickDeletable
                ? [""]
                : []
              ).concat(
                ["שם", "נוכחות", "סיבת היעדרות", "מיקום"].concat(
                  otherAttributes,
                ),
              ),
              body: filteredNames.map((personName) =>
                (course.attributes![attribute].quickDeletable
                  ? [""]
                  : []
                ).concat(
                  [
                    personName,
                    course.people![personName].present ? "נוכח/ת" : "חסר/ה",
                    course.people![personName].absenceReason ?? "",
                    course.people![personName].location ?? "",
                  ].concat(
                    otherAttributes.map(
                      (attribute) =>
                        course.people![personName].attributes[attribute],
                    ),
                  ),
                ),
              ),
            }}
            renderHead={(columnName) => (
              <>
                <p style={{ display: "inline" }}>{columnName}</p>
                {course.attributes![columnName]?.description !== undefined && (
                  <p style={{ fontWeight: "normal", fontSize: 12 }}>
                    {course.attributes![columnName]!.description}
                  </p>
                )}
              </>
            )}
            renderValue={(rowIndex, columnName, value) => {
              if (columnName === "") {
                return (
                  <Tooltip label={`הסרה מה${attribute}`}>
                    <ActionIcon
                      color="red"
                      onClick={() => {
                        modals.openConfirmModal({
                          title: "אנא וודאו את פעולתכם!",
                          children: `האם אתם בטוחים שברצונכם להסיר את ${filteredNames[rowIndex]} מה${attribute}?`,
                          labels: { confirm: "אישור", cancel: "ביטול" },
                          onConfirm: () =>
                            updateCourse(
                              {
                                [`people.${filteredNames[rowIndex]}.attributes.${attribute}`]:
                                  deleteField(),
                              },
                              setLoading,
                            ),
                        })
                      }}
                      loading={loading}
                    >
                      <FontAwesome icon="trash" />
                    </ActionIcon>
                  </Tooltip>
                )
              }

              if (columnName === "שם") {
                return (
                  <React.Fragment key={rowIndex}>
                    {Object.keys(course.attributes ?? {})
                      .filter(
                        (a) =>
                          course.attributes![a].isButton &&
                          course.people![filteredNames[rowIndex]].attributes[
                            a
                          ] !== undefined &&
                          course.people![filteredNames[rowIndex]].attributes[
                            a
                          ] !== "",
                      )
                      .sort()
                      .map((attributeName, attributeIndex) => (
                        <ActionIcon
                          variant="transparent"
                          ml={5}
                          key={attributeIndex}
                          component="a"
                          color={course.attributes![attributeName].color}
                          href={
                            course.people![filteredNames[rowIndex]].attributes[
                              attributeName
                            ]
                          }
                        >
                          <FontAwesome
                            icon={
                              course.attributes![attributeName]
                                .icon as FontAwesomeIcon
                            }
                          />
                        </ActionIcon>
                      ))}
                    <LinkAnchor href={`/people/${filteredNames[rowIndex]}`}>
                      {filteredNames[rowIndex]}
                    </LinkAnchor>
                  </React.Fragment>
                )
              }

              if (columnName === "נוכחות") {
                const presenceUpdater =
                  course.people![filteredNames[rowIndex]].presenceUpdater ?? ""
                return (
                  <div
                    key={rowIndex}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Switch
                      my={6}
                      size="md"
                      offLabel="חסר/ה"
                      onLabel="נוכח/ת"
                      checked={
                        course.people![filteredNames[rowIndex]].present ?? false
                      }
                      onChange={(e) => {
                        const updates: Record<string, any> = {
                          [`people.${filteredNames[rowIndex]}.present`]:
                            e.currentTarget.checked,
                          [`people.${filteredNames[rowIndex]}.presenceUpdater`]:
                            getUpdater(),
                        }
                        updates[`people.${filteredNames[rowIndex]}.location`] =
                          e.currentTarget.checked ? myLocation : ""
                        updateCourse(updates, setLoading)
                      }}
                    />
                    {value !== "חסר/ה" && presenceUpdater !== "" && (
                      <span
                        style={{ marginTop: 5, fontSize: 10, opacity: 0.7 }}
                      >
                        {presenceUpdater}
                      </span>
                    )}
                  </div>
                )
              }

              if (columnName === "סיבת היעדרות") {
                const absenceReasonUpdater =
                  course.people![filteredNames[rowIndex]]
                    .absenceReasonUpdater ?? ""
                return (
                  <div
                    key={rowIndex}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <AbsenceEditor
                      defaultValue={value}
                      setValue={(v, setLoading) =>
                        updateCourse(
                          {
                            [`people.${filteredNames[rowIndex]}.absenceReason`]:
                              v,
                            [`people.${filteredNames[rowIndex]}.absenceReasonUpdater`]:
                              getUpdater(),
                          },
                          setLoading,
                        )
                      }
                    />
                    {value !== "" && absenceReasonUpdater !== "" && (
                      <span
                        style={{ marginTop: 5, fontSize: 10, opacity: 0.7 }}
                      >
                        {absenceReasonUpdater}
                      </span>
                    )}
                  </div>
                )
              }

              if ((course.attributes ?? {})[columnName]?.kind === "boolean") {
                return (
                  <Switch
                    checked={value === "true"}
                    onChange={(e) =>
                      updateCourse(
                        {
                          [`people.${filteredNames[rowIndex]}.attributes.${columnName}`]:
                            e.currentTarget.checked ? "true" : "false",
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
          {(course.attributes ?? {})[attribute]?.quickDeletable && (
            <Fieldset legend="שיוך" mt="xs">
              <Autocomplete
                value={addName}
                onChange={setAddName}
                label="שם"
                data={Object.keys(course.people ?? {})
                  .filter(
                    (name) => !filteredNames.includes(name) && name !== addName,
                  )
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
                  {attributes.map((attributeName, attributeIndex) => (
                    <p key={attributeIndex}>
                      {attributeName}: {personToAdd.attributes[attributeName]}
                    </p>
                  ))}
                </Alert>
              )}
            </Fieldset>
          )}
        </>
      )}
    </div>
  )
}

export default FilteredPeoplePage
