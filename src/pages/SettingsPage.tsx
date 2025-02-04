import AddAttribute from "../components/AddAttribute"
import AddPerson from "../components/AddPerson"
import DropCSV from "../components/DropCSV"

const SettingsPage = () => {
  return (
    <>
      <h1>הגדרות</h1>
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
