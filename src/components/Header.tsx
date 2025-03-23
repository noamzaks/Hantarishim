import { ActionIcon, Loader, Tooltip } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import FontAwesome, { FontAwesomeIcon } from "./FontAwesome"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"

const Header = ({
  links,
}: {
  links: { title: string; url: string; icon: FontAwesomeIcon }[]
}) => {
  const navigate = useNavigate()
  const [currentUser, loading] = useAuthState(auth)

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
          <Loader size="sm" ml="xs" />
          <span>מתחבר...</span>
        </>
      )}
      {!loading && currentUser !== undefined && currentUser !== null && (
        <>
          {links.map((link, linkIndex) => (
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
          <span style={{ flexGrow: 1 }} />
          <Tooltip label="התנתקות">
            <ActionIcon size="lg" mr={5} onClick={() => signOut(auth)}>
              <FontAwesome icon="right-from-bracket" />
            </ActionIcon>
          </Tooltip>
        </>
      )}
    </header>
  )
}

export default Header
