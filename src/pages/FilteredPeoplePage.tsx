import { useParams } from "react-router-dom"
import { useCourse } from "../models"
import { Button, Switch } from "@mantine/core"
import FontAwesome from "../components/FontAwesome"
import { useState } from "react"
import DataTable from "../components/DataTable"
import React from "react"
import LinkAnchor from "../components/LinkAnchor"

const FilteredPeoplePage = () => {
  const [resettingPresence, setResettingPresence] = useState(false)
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useCourse()
  const params = useParams()

  const attribute = params.attribute!
  const attributeValue = params.value!
  const filteredNames = Object.keys(course.people ?? {})
    .filter(
      (personName) =>
        course.people![personName].attributes[attribute] === attributeValue
    )
    .sort()

  const present = filteredNames.filter(
    (personName) => course.people![personName].present
  ).length

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <h1>
          {attribute}: {attributeValue}
        </h1>
        <p style={{ marginBottom: 5 }}>
          <b>כאן:</b> {present} • <b>חסרים/חסרות:</b>{" "}
          {filteredNames.length - present}• <b>חסרים/חסרות:</b>{" "}
          {filteredNames
            .filter((personName) => !course.people![personName].present)
            .map((personName) => {
              const info = course.people![personName]
              if (info.absenceReason) {
                return `${personName} (${info.absenceReason})`
              }
              return personName
            })
            .join(", ")}
        </p>
        <Button
          variant="default"
          loading={resettingPresence}
          leftSection={<FontAwesome icon="rotate-left" />}
          onClick={() => {
            for (const name of filteredNames) {
              course.people![name].present = false
            }
            setCourse(course, setResettingPresence)
          }}
        >
          איפוס נוכחות
        </Button>
      </div>
      <div style={{ maxWidth: 300 }}>
        <DataTable
          tableName="אנשים"
          data={{
            head: ["שם", "נוכחות"],
            body: filteredNames.map((personName) => [
              personName,
              course.people![personName].present ? "נוכח/ת" : "חסר/ה",
            ]),
          }}
          renderValue={(rowIndex, columnName, value) => {
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
                  label={value}
                  key={rowIndex}
                  checked={
                    course.people![filteredNames[rowIndex]].present ?? false
                  }
                  disabled={loading}
                  onChange={(e) => {
                    course.people![filteredNames[rowIndex]].present =
                      e.currentTarget.checked
                    setCourse(course, setLoading)
                  }}
                />
              )
            }

            return <React.Fragment key={rowIndex}>{value}</React.Fragment>
          }}
          hideDownload
        />
      </div>
    </>
  )
}

export default FilteredPeoplePage
