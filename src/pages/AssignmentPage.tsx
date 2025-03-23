import { useParams } from "react-router-dom"
import { useCourse } from "../models"
import DataTable from "../components/DataTable"
import { Switch } from "@mantine/core"
import React, { useState } from "react"
import LinkAnchor from "../components/LinkAnchor"

const AssignmentPage = () => {
  const [course, setCourse] = useCourse()
  const params = useParams()
  const [loading, setLoading] = useState(false)

  const assignmentName = params.assignment!
  const assignment = course.assignments!.find((a) => a.name === assignmentName)!

  const people = Object.keys(course.people ?? {})
    .filter(
      assignment.kind === "person"
        ? (personName) => assignment.targets.includes(personName)
        : assignment.kind === "attribute"
          ? (personName) =>
              assignment.targets.includes(
                course.people![personName].attributes[assignment.attribute!],
              )
          : (personName) =>
              assignment.targets.some((target) =>
                (course.groups ?? {})[target]?.includes(personName),
              ),
    )
    .sort()

  return (
    <>
      <h1>{assignmentName}</h1>
      <p>
        <b>תיאור:</b> {assignment.description}
      </p>
      <p>
        <b>תאריך הגשה:</b> {assignment.due}
      </p>
      <p>
        <b>יעדים:</b> {assignment.targets}
        {assignment.attribute ? ` (${assignment.attribute})` : ""}
      </p>

      <h2>אנשים</h2>
      <DataTable
        tableName={assignmentName}
        data={{
          head: ["שם", "הוגש"],
          body: people.map((personName) => [
            personName,
            course.people![personName].submitted.includes(assignmentName)
              ? "כן"
              : "לא",
          ]),
        }}
        renderValue={(rowIndex, columnName, value) => {
          if (columnName === "שם") {
            return (
              <LinkAnchor key={rowIndex} href={`/people/${value}`}>
                {value}
              </LinkAnchor>
            )
          }

          if (columnName === "הוגש") {
            return (
              <Switch
                key={rowIndex}
                label={value}
                checked={value === "כן"}
                disabled={loading}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    course.people![people[rowIndex]].submitted.push(
                      assignmentName,
                    )
                  } else {
                    course.people![people[rowIndex]].submitted = course.people![
                      people[rowIndex]
                    ].submitted.filter((a) => a !== assignmentName)
                  }
                  setCourse(course, setLoading)
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

export default AssignmentPage
