import { useParams } from "react-router-dom"
import { useCourse } from "../models"
import { Button, Loader, Switch } from "@mantine/core"
import FontAwesome from "../components/FontAwesome"
import { useState } from "react"
import DataTable from "../components/DataTable"
import React from "react"
import LinkAnchor from "../components/LinkAnchor"

const FilteredPeoplePage = () => {
  const [resettingPresence, setResettingPresence] = useState(false)
  const [focusedView, setFocusedView] = useState(false)
  const [loading, setLoading] = useState(false)
  const [course, setCourse, updateCourse] = useCourse()
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
  const attributes = Object.keys(course.attributes ?? {})
    .sort()
    .filter(
      (x) =>
        x !== attribute &&
        !(course.attributes![attribute].derivativeAttributes ?? []).includes(x)
    )

  const splitter = focusedView ? <br /> : "•"

  return (
    <div>
      <h1>
        {attribute}: {attributeValue}
        <Button
          size="xs"
          mr="xs"
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
      </h1>
      <p style={{ marginBottom: 5, fontSize: focusedView ? 22 : undefined }}>
        <b>כאן:</b> {present} {splitter} <b>חסרים/חסרות:</b>{" "}
        {filteredNames.length - present}
        {splitter} <b>פירוט:</b>{" "}
        {filteredNames
          .filter((personName) => !course.people![personName].present)
          .sort((a, b) => {
            const infoA = course.people![a]
            const infoB = course.people![b]
            return (infoB.absenceReason ?? "").localeCompare(
              infoA.absenceReason ?? ""
            )
          })
          .map((personName) => {
            const info = course.people![personName]
            if (info.absenceReason) {
              return `${personName} (${info.absenceReason})`
            }
            return personName
          })
          .join(", ")}
      </p>
      {!focusedView && (
        <>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
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
            {loading && (
              <>
                <Loader size="sm" mx="xs" />
                <span>מעדכן את הנוכחות בשרת...</span>
              </>
            )}
          </div>
          <DataTable
            tableName="אנשים"
            data={{
              head: ["שם", "נוכחות", "סיבת היעדרות"].concat(attributes),
              body: filteredNames.map((personName) =>
                [
                  personName,
                  course.people![personName].present ? "נוכח/ת" : "חסר/ה",
                  course.people![personName].absenceReason ?? "",
                ].concat(
                  attributes.map(
                    (attribute) =>
                      course.people![personName].attributes[attribute]
                  )
                )
              ),
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
                    onChange={(e) => {
                      updateCourse(
                        {
                          [`people.${filteredNames[rowIndex]}.present`]:
                            e.currentTarget.checked,
                        },
                        setLoading
                      )
                    }}
                  />
                )
              }

              return <React.Fragment key={rowIndex}>{value}</React.Fragment>
            }}
          />
        </>
      )}
    </div>
  )
}

export default FilteredPeoplePage
