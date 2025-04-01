import { Switch } from "@mantine/core"
import AddAttribute from "../components/AddAttribute"
import AddPerson from "../components/AddPerson"
import DropCSV from "../components/DropCSV"
import PersonChooser from "../components/PersonChooser"
import { useCourse } from "../models"
import { useState } from "react"

const SettingsPage = () => {
  const [course, updateCourse] = useCourse()
  const [loading, setLoading] = useState(false)

  return (
    <>
      <h1>הגדרות</h1>
      <PersonChooser />
      <Switch
        label="נעילת עריכה (נא לא לגעת)"
        checked={course.locked ?? false}
        onChange={(e) =>
          updateCourse({ locked: e.currentTarget.checked }, setLoading)
        }
        disabled={loading}
        mt="xs"
      />
      {!course.locked && (
        <>
          <h2>מאפיינים</h2>
          <AddAttribute />
          <h2>אנשים</h2>
          <AddPerson />
          <h2>העלאת CSV</h2>
          <DropCSV />
        </>
      )}
    </>
  )
}

export default SettingsPage
