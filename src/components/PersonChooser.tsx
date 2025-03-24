import { Autocomplete } from "@mantine/core"
import { useCourse } from "../models"
import FontAwesome from "./FontAwesome"
import { useLocalStorage } from "../lib/hooks"

const PersonChooser = () => {
  const [course] = useCourse()
  const [me, setMe] = useLocalStorage<string>({ key: "Me", defaultValue: "" })

  return (
    <Autocomplete
      label="מי אני?"
      data={Object.keys(course.people ?? {}).sort()}
      mb="xs"
      leftSection={<FontAwesome icon="user" />}
      value={me}
      onChange={setMe}
    />
  )
}

export default PersonChooser
