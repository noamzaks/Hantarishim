import { TextInput, TextInputProps } from "@mantine/core"
import FontAwesome, { FontAwesomeIcon } from "./FontAwesome"

const IconPicker = (
  props: TextInputProps & { icon: string; setIcon: (icon: string) => void },
) => {
  return (
    <TextInput
      value={props.icon}
      onChange={(e) => props.setIcon(e.currentTarget.value)}
      label="אייקון"
      leftSection={<FontAwesome icon={props.icon as FontAwesomeIcon} />}
      {...{ ...props, icon: undefined, setIcon: undefined }}
    />
  )
}

export default IconPicker
