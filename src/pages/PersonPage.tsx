import { useParams } from "react-router-dom"
import { getAttributes, useCourse } from "../models"
import { ActionIcon, Switch, TextInput } from "@mantine/core"
import React, { useEffect, useState } from "react"
import FontAwesome, { FontAwesomeIcon } from "../components/FontAwesome"
import LinkButton from "../components/LinkButton"
import DataTable from "../components/DataTable"
import LinkAnchor from "../components/LinkAnchor"
import { arrayRemove, arrayUnion } from "firebase/firestore"

const PersonPage = () => {
  const [course, _, updateCourse] = useCourse()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [submittingAssignment, setSubmittingAssignment] = useState(false)
  const [absenceReason, setAbsenceReason] = useState("")

  const name = params.name!
  const info = course.people![name]

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

  useEffect(() => {
    setAbsenceReason(info.absenceReason ?? "")
  }, [info])

  return (
    <>
      <h1>{name}</h1>
      <Switch
        size="md"
        offLabel="חסר/ה"
        onLabel="נוכח/ת"
        mb={5}
        disabled={loading}
        checked={info.present ?? false}
        onChange={(e) => {
          updateCourse(
            { [`people.${name}.present`]: e.currentTarget.checked },
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
                { [`people.${name}.absenceReason`]: absenceReason },
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

            if (attribute.filterable && info.attributes[attributeName] !== undefined) {
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
                  {info.attributes[attributeName] !== undefined ? `${attributeName}: ${info.attributes[attributeName]}` : ""}
                </p>
              )
            }
          })}
        </>
      )}

      <h2>מטלות</h2>
      <DataTable
        hideIfEmpty
        tableName="מטלות"
        data={{
          head: ["שם", "תאריך הגשה", "הוגש"],
          body: assignments.map((assignment) => [
            assignment.name,
            assignment.due,
            info.submitted.includes(assignment.name) ? "כן" : "לא",
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

          return <React.Fragment key={rowIndex}>{value}</React.Fragment>
        }}
      />
    </>
  )
}

export default PersonPage
