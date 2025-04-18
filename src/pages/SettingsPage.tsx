import { Switch } from "@mantine/core"
import AddAttribute from "../components/AddAttribute"
import AddPerson from "../components/AddPerson"
import DropCSV from "../components/DropCSV"
import PersonChooser from "../components/PersonChooser"
import { useCourse } from "../models"
import { useState } from "react"
import { useLocalStorage } from "../lib/hooks"
import FilterPeople from "../components/FilterPeople"

const SettingsPage = () => {
  const [course, updateCourse] = useCourse()
  const [localMode, setLocalMode] = useLocalStorage<boolean>({
    key: "Local Mode",
    defaultValue: false,
  })
  const [loading, setLoading] = useState(false)

  return (
    <>
      <h1>הגדרות</h1>
      <PersonChooser />
      <FilterPeople />
      {!localMode && (
        <Switch
          label="מצב לוקאלי (שינויים במכשיר הנוכחי בלבד, לא מתעדכן ולא מעדכן מכשירים אחרים)"
          checked={localMode}
          onChange={(e) => setLocalMode(e.currentTarget.checked)}
          mt="xs"
        />
      )}
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
