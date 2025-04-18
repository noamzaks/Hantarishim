import { Dropzone } from "@mantine/dropzone"
import FontAwesome from "./FontAwesome"
import { useState } from "react"
import { useCourse } from "../models"

const DropCSV = () => {
  const [course, updateCourse] = useCourse()
  const [loading, setLoading] = useState(false)

  return (
    <Dropzone
      loading={loading}
      multiple={false}
      onDrop={async (files) => {
        setLoading(true)
        try {
          if (!course.people) {
            course.people = {}
          }

          for (const file of files) {
            const text = await file.text()
            const [line, ...lines] = text.split("\n")
            const attributeNames = line
              .split(",")
              .slice(1)
              .map((x) => x.trim())

            for (const line of lines) {
              const [personName, ...attributeValues] = line
                .split(",")
                .map((x) => x.trim())

              if (attributeValues.length !== attributeNames.length) {
                continue
              }

              course.people[personName] = {
                // @ts-ignore
                present: false,
                // @ts-ignore
                attributes: {},
                // @ts-ignore
                submitted: [],
                ...((course.people ?? {})[personName] ?? {}),
              }
              for (let i = 0; i < attributeNames.length; i++) {
                course.people[personName].attributes[attributeNames[i]] =
                  attributeValues[i]
              }
            }
          }

          updateCourse({ people: course.people }, setLoading)
        } finally {
          setLoading(false)
        }
      }}
      accept={["text/csv"]}
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <FontAwesome
        icon="upload"
        props={{ style: { fontSize: 24, marginBottom: 20 } }}
      />
      <p>לחצו או גררו לכאן קובץ CSV מתאים לפורמט</p>
    </Dropzone>
  )
}

export default DropCSV
