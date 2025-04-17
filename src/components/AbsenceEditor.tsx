import { ActionIcon, Textarea } from "@mantine/core"
import { useEffect, useState } from "react"
import FontAwesome from "./FontAwesome"

const AbsenceEditor = ({
  defaultValue,
  setValue: setValuePersistent,
}: {
  defaultValue: string
  setValue: (
    v: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void
}) => {
  const [value, setValue] = useState<string>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!value && defaultValue !== undefined) {
      setValue(defaultValue)
    }
  }, [defaultValue])

  return (
    <Textarea
      autosize
      flex="none"
      miw="200"
      maw="300"
      value={value ?? ""}
      onChange={(e) => setValue(e.currentTarget.value)}
      rightSection={
        <ActionIcon
          loading={loading}
          onClick={() => {
            setValuePersistent(value ?? "", setLoading)
          }}
        >
          <FontAwesome icon="floppy-disk" />
        </ActionIcon>
      }
    />
  )
}

export default AbsenceEditor
