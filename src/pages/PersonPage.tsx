import { useParams } from "react-router-dom"
import { getAttributes, useCourse } from "../models"
import { ActionIcon, Switch, TextInput } from "@mantine/core"
import React, { useEffect, useState } from "react"
import FontAwesome from "../components/FontAwesome"
import LinkButton from "../components/LinkButton"
import DataTable from "../components/DataTable"
import LinkAnchor from "../components/LinkAnchor"

const PersonPage = () => {
  const [course, setCourse] = useCourse()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [submittingAssignment, setSubmittingAssignment] = useState(false)
  const [absenceReason, setAbsenceReason] = useState("")

  const name = params.name!
  const info = course.people![name]

  const assignments = (course.assignments ?? []).filter(
    (assignment) =>
      (assignment.kind === "person" && assignment.target === name) ||
      (assignment.kind === "attribute" &&
        info.attributes[assignment.attribute!] === assignment.target)
  )

  useEffect(() => {
    setAbsenceReason(info.absenceReason ?? "")
  }, [info])

  return (
    <>
      <h1>{name}</h1>
      <Switch
        label="נוכח/ת"
        mb={5}
        disabled={loading}
        checked={info.present ?? false}
        onChange={(e) => {
          info.present = e.currentTarget.checked
          setCourse(course, setLoading)
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
              info.absenceReason = absenceReason
              setCourse(course, setLoading)
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

            if (attribute.filterable) {
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
                  {attributeName}: {info.attributes[attributeName]}
                </LinkButton>
              )
            } else {
              return (
                <p key={attributeIndex}>
                  {attributeName}: {info.attributes[attributeName]}
                </p>
              )
            }
          })}
        </>
      )}

      <h2>מטלות</h2>
      <DataTable
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
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    info.submitted.push(assignments[rowIndex].name)
                  } else {
                    info.submitted = info.submitted.filter(
                      (a) => a !== assignments[rowIndex].name
                    )
                  }
                  setCourse(course, setSubmittingAssignment)
                }}
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
