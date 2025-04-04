import { useParams } from "react-router-dom"
import { getAttributes, useCourse } from "../models"
import { ActionIcon, Switch, TextInput } from "@mantine/core"
import React, { useEffect, useState } from "react"
import FontAwesome, { FontAwesomeIcon } from "../components/FontAwesome"
import LinkButton from "../components/LinkButton"
import DataTable from "../components/DataTable"
import LinkAnchor from "../components/LinkAnchor"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { useLocalStorage } from "../lib/hooks"
import { getUpdater } from "../utilities"
import Countdown from "../components/Countdown"

const PersonPage = () => {
  const [course, updateCourse] = useCourse()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [submittingAssignment, setSubmittingAssignment] = useState(false)
  const [absenceReason, setAbsenceReason] = useState("")
  const [me] = useLocalStorage({ key: "Me" })
  const [editMe, setEditMe] = useLocalStorage<boolean>({
    key: "Edit Me",
    defaultValue: false,
  })

  const name = params.name!
  const info = (course.people ?? {})[name]

  useEffect(() => {
    setAbsenceReason(info?.absenceReason ?? "")
  }, [info])

  if (info === undefined) {
    return <>וואו, אתם בטוחים שהבן אדם הזה קיים?</>
  }

  const assignments = (course.assignments ?? []).filter(
    (assignment) =>
      (assignment.kind === "person" && assignment.targets.includes(name)) ||
      (assignment.kind === "attribute" &&
        assignment.targets.includes(info.attributes[assignment.attribute!])) ||
      (assignment.kind === "group" &&
        assignment.targets.some((target) =>
          (course.groups ?? {})[target]?.includes(name),
        )),
  )

  return (
    <>
      <h1>{name}</h1>
      {name === me && (
        <Switch
          mb="xs"
          label="עריכת נוכחות"
          checked={editMe}
          onChange={(e) => setEditMe(e.currentTarget.checked)}
        />
      )}
      {(name !== me || editMe) && (
        <>
          <Switch
            size="md"
            offLabel="חסר/ה"
            onLabel="נוכח/ת"
            mb={5}
            disabled={loading}
            checked={info.present ?? false}
            onChange={(e) => {
              updateCourse(
                {
                  [`people.${name}.present`]: e.currentTarget.checked,
                  [`people.${name}.presenceUpdater`]: getUpdater(),
                },
                setLoading,
              )
            }}
          />
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
                  updateCourse(
                    {
                      [`people.${name}.absenceReason`]: absenceReason,
                      [`people.${name}.absenceReasonUpdater`]: getUpdater(),
                    },
                    setLoading,
                  )
                }}
              >
                <FontAwesome icon="floppy-disk" />
              </ActionIcon>
            }
          />
          {info && (
            <>
              {getAttributes(course).map((attributeName, attributeIndex) => {
                const attribute = course.attributes![attributeName]

                if (
                  attribute.filterable &&
                  info.attributes[attributeName] !== undefined
                ) {
                  return (
                    <LinkButton
                      size="xs"
                      radius="xl"
                      my={5}
                      ml={5}
                      key={attributeIndex}
                      color={course.attributes![attributeName].color}
                      href={`/people/${attributeName}/${info.attributes[attributeName]}`}
                    >
                      {course.attributes![attributeName].icon !== undefined && (
                        <FontAwesome
                          icon={
                            course.attributes![attributeName]
                              .icon as FontAwesomeIcon
                          }
                          props={{ style: { marginInlineEnd: 5 } }}
                        />
                      )}{" "}
                      {attributeName}: {info.attributes[attributeName]}
                    </LinkButton>
                  )
                } else {
                  return (
                    <p key={attributeIndex}>
                      {info.attributes[attributeName] !== undefined
                        ? `${attributeName}: ${info.attributes[attributeName]}`
                        : ""}
                    </p>
                  )
                }
              })}
            </>
          )}
        </>
      )}
      <h2>מטלות</h2>
      <DataTable
        defaultSort={2}
        defaultReversed={true}
        hideIfEmpty
        tableName="מטלות"
        data={{
          head: ["שם", "תאריך הגשה", "הוגש", "תיאור"],
          body: assignments.map((assignment) => [
            assignment.name,
            assignment.due === "" ? assignment.due : assignment.due,
            info.submitted.includes(assignment.name) ? "כן" : "לא",
            assignment.description,
          ]),
        }}
        renderValue={(rowIndex, columnName, value) => {
          if (columnName === "שם") {
            return (
              <LinkAnchor key={rowIndex} href={`/assignments/${value}`}>
                {value}
              </LinkAnchor>
            )
          }

          if (columnName === "תאריך הגשה") {
            if (value === "") {
              return <React.Fragment key={rowIndex}>{value}</React.Fragment>
            }
            const d = new Date(value)
            return (
              <span
                key={rowIndex}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span>{d.toLocaleString("he-il")}</span>
                <Countdown date={d} />
              </span>
            )
          }

          if (columnName === "הוגש") {
            return (
              <Switch
                key={rowIndex}
                label={value}
                checked={info.submitted.includes(assignments[rowIndex].name)}
                disabled={submittingAssignment}
                onChange={(e) =>
                  updateCourse(
                    {
                      [`people.${name}.submitted`]: e.currentTarget.checked
                        ? arrayUnion(assignments[rowIndex].name)
                        : arrayRemove(assignments[rowIndex].name),
                    },
                    setSubmittingAssignment,
                  )
                }
              />
            )
          }

          if (columnName === "תיאור") {
            return (
              <span key={rowIndex} style={{ whiteSpace: "pre" }}>
                {value}
              </span>
            )
          }

          return <React.Fragment key={rowIndex}>{value}</React.Fragment>
        }}
      />
    </>
  )
}

export default PersonPage
