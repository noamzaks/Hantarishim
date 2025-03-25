import { useParams } from "react-router-dom"
import { FormQuestion, FormQuestionKind, useCourse } from "../models"
import {
  ActionIcon,
  Button,
  Select,
  Switch,
  Tabs,
  TextInput,
  Tooltip,
} from "@mantine/core"
import FontAwesome from "../components/FontAwesome"
import { useEffect, useState } from "react"
import React from "react"

const FormPage = () => {
  const [course, setCourse] = useCourse()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const formName = params.form!
  const [questions, setQuestions] = useState<FormQuestion[]>([])

  const form = course.forms!.find((form) => form.name === formName)

  useEffect(() => {
    setQuestions(form?.questions ?? [])
  }, [form, formName])

  if (!form) {
    return <></>
  }

  return (
    <>
      <h1>{formName}</h1>
      <p>
        <b>יעדים:</b> {form.targets}
        {form.attribute ? ` (${form.attribute})` : ""}
      </p>
      <Tabs mt="xs" defaultValue="edit">
        <Tabs.List>
          <Tabs.Tab value="edit">
            <FontAwesome
              icon="pen"
              props={{ style: { marginInlineEnd: 10 } }}
            />
            עריכה
          </Tabs.Tab>
          <Tabs.Tab value="analyze">
            <FontAwesome
              icon="chart-line"
              props={{ style: { marginInlineEnd: 10 } }}
            />
            ניתוח
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="edit" pt="xs">
          {questions.map((question, questionIndex) => (
            <React.Fragment key={questionIndex}>
              <div
                style={{
                  display: "flex",
                  marginBottom: 5,
                  alignItems: "center",
                }}
              >
                <TextInput
                  style={{ flexGrow: 1 }}
                  placeholder="מלל השאלה..."
                  value={question.prompt ?? ""}
                  onChange={(e) => {
                    question.prompt = e.currentTarget.value
                    setQuestions([...questions])
                  }}
                />
                <Tooltip label="מחיקת השאלה">
                  <ActionIcon
                    color="red"
                    flex="none"
                    mr="xs"
                    onClick={() => {
                      questions.splice(questionIndex, 1)
                      setQuestions([...questions])
                    }}
                  >
                    <FontAwesome icon="trash" />
                  </ActionIcon>
                </Tooltip>
              </div>
              <div
                style={{
                  display: "flex",
                  marginBottom: 15,
                  alignItems: "center",
                }}
              >
                <Select
                  placeholder="סוג"
                  data={[
                    { label: "דירוג", value: "scale" },
                    { label: "טקסט", value: "text" },
                  ]}
                  ml="xs"
                  value={question.kind ?? null}
                  onChange={(v) => {
                    if (v) {
                      question.kind = v as FormQuestionKind
                    } else {
                      delete question.kind
                    }
                    setQuestions([...questions])
                  }}
                  style={{ flexGrow: 1 }}
                />
                <Switch
                  flex="none"
                  label="חובה"
                  checked={question.required ?? false}
                  onChange={(e) => {
                    question.required = e.currentTarget.checked
                    setQuestions([...questions])
                  }}
                />
              </div>
            </React.Fragment>
          ))}
          <Button
            leftSection={<FontAwesome icon="plus" />}
            onClick={() => setQuestions((q) => [...q, {}])}
            fullWidth
          >
            הוספת שאלה
          </Button>
          <Button
            mt="md"
            leftSection={<FontAwesome icon="floppy-disk" />}
            onClick={() => {
              form.questions = questions
              setCourse(course, setLoading)
            }}
            fullWidth
            loading={loading}
          >
            שמירת הסקר
          </Button>
        </Tabs.Panel>

        <Tabs.Panel value="analyze" pt="xs">
          בתהליכים!
        </Tabs.Panel>
      </Tabs>
    </>
  )
}

export default FormPage
