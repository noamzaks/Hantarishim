import { useParams } from "react-router-dom"
import { useCourse } from "../models"
import DataTable from "../components/DataTable"
import { Switch } from "@mantine/core"
import React, { useState } from "react"
import LinkAnchor from "../components/LinkAnchor"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { useLocalStorage } from "../lib/hooks"

const AssignmentPage = () => {
  const [course, updateCourse] = useCourse()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [filterAttribute] = useLocalStorage<string | null>({
    key: "Filter Attribute",
    defaultValue: null,
  })
  const [filterValue] = useLocalStorage<string | undefined>({
    key: "Filter Value",
    defaultValue: undefined,
  })

  const assignmentName = params.assignment!
  const assignment = course.assignments!.find((a) => a.name === assignmentName)!

  if (!assignment) {
    return (
      <>
        אופס, המטלה הזאת לא נמצאה ({assignmentName}) (
        {course.assignments?.map((a) => a.name)?.join(", ")})
      </>
    )
  }

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
  const filteredPeople = filterAttribute
    ? people.filter(
        (person) =>
          course.people![person].attributes[filterAttribute] === filterValue,
      )
    : people

  return (
    <>
      <h1>{assignmentName}</h1>
      <p style={{ whiteSpace: "pre" }}>
        <b>תיאור:</b>
        <br />
        {assignment.description}
      </p>
      <p>
        <b>תאריך הגשה:</b>{" "}
        {assignment.due === ""
          ? assignment.due
          : new Date(assignment.due).toLocaleString("he-il")}
      </p>
      {filteredPeople.filter(
        (personName) =>
          !course.people![personName].submitted?.includes(assignmentName),
      ).length < 100 && (
        <p>
          <b>לא הגישו:</b>{" "}
          {filteredPeople
            .filter(
              (personName) =>
                !course.people![personName].submitted?.includes(assignmentName),
            )
            .join(", ")}
        </p>
      )}
      <p>
        <b>יעדים:</b> {assignment.targets}
        {assignment.attribute ? ` (${assignment.attribute})` : ""}
      </p>
      <h2>אנשים</h2>
      <DataTable
        tableName={assignmentName}
        data={{
          head: ["שם", "הוגש"],
          body: filteredPeople.map((personName) => [
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
                  updateCourse(
                    {
                      [`people.${filteredPeople[rowIndex]}.submitted`]: e
                        .currentTarget.checked
                        ? arrayUnion(assignmentName)
                        : arrayRemove(assignmentName),
                    },
                    setLoading,
                  )
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
