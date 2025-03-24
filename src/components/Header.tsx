import { ActionIcon, Loader, Tooltip } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import FontAwesome, { FontAwesomeIcon } from "./FontAwesome"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import { useLocalStorage } from "../lib/hooks"

const Header = ({
  links,
}: {
  links: { title: string; url: string; icon: FontAwesomeIcon }[]
}) => {
  const navigate = useNavigate()
  const [currentUser, loading] = useAuthState(auth)
  const [me] = useLocalStorage<string>({ key: "Me", defaultValue: "" })

  return (
    <header
      style={{
        height: 60,
        backgroundColor: "var(--mantine-color-violet-4)",
        color: "white",
        flex: "none",
        display: "flex",
        alignItems: "center",
        padding: 10,
        overflow: "auto",
      }}
    >
      <h3
        style={{ marginInline: 10, cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        חנתרישים
      </h3>
      {loading && (
        <>
          <Loader size="sm" ml={5} />
          <span>מתחבר...</span>
        </>
      )}
      {!loading && currentUser !== undefined && currentUser !== null && (
        <>
          <span style={{ overflow: "auto", display: "flex" }}>
            {(me === ""
              ? links
              : [
                  {
                    title: "דף אישי",
                    url: `/people/${me}`,
                    icon: "home" as FontAwesomeIcon,
                  },
                  ...links,
                ]
            ).map((link, linkIndex) => (
              <Tooltip label={link.title} key={linkIndex}>
                <ActionIcon
                  mx={5}
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(link.url)
                  }}
                  component="a"
                  href={link.url}
                >
                  <FontAwesome icon={link.icon} />
                </ActionIcon>
              </Tooltip>
            ))}
          </span>

          <span style={{ flexGrow: 1 }} />
          <Tooltip label="התנתקות">
            <ActionIcon size="lg" mr={10} onClick={() => signOut(auth)}>
              <FontAwesome icon="right-from-bracket" />
            </ActionIcon>
          </Tooltip>
        </>
      )}
    </header>
  )
}

export default Header
