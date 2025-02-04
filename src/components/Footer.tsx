import { Anchor, useMantineTheme } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import FontAwesome from "./FontAwesome"

const Footer = () => {
  const theme = useMantineTheme()
  const colorScheme = useColorScheme()

  return (
    <footer
      style={{
        height: 40,
        backgroundColor:
          colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[1],
        flex: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      © קוד פתוח ב
      <Anchor href="https://opensource.org/license/mit">רישיון MIT</Anchor>
      <Anchor href="https://github.com/noamzaks/hantarishim" mr={5}>
        <FontAwesome icon="github" kind="brands" />
      </Anchor>
    </footer>
  )
}

export default Footer
