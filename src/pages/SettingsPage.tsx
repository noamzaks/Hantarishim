import AddAttribute from "../components/AddAttribute"
import AddPerson from "../components/AddPerson"
import DropCSV from "../components/DropCSV"
import PersonChooser from "../components/PersonChooser"

const SettingsPage = () => {
  return (
    <>
      <h1>הגדרות</h1>
      <PersonChooser />
      <h2>מאפיינים</h2>
      <AddAttribute />
      <h2>אנשים</h2>
      <AddPerson />
      <h2>העלאת CSV</h2>
      <DropCSV />
    </>
  )
}

export default SettingsPage
