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
  const [localMode] = useLocalStorage<boolean>({
    key: "Local Mode",
    defaultValue: false,
  })
  const [filterAttribute] = useLocalStorage<string | null>({
    key: "Filter Attribute",
    defaultValue: null,
  })
  const [filterValue] = useLocalStorage<string | undefined>({
    key: "Filter Value",
    defaultValue: undefined,
  })

  return (
    <header
      style={{
        height: 60,
        backgroundColor: localMode
          ? "var(--mantine-color-green-7)"
          : "var(--mantine-color-violet-4)",
        color: "white",
        flex: "none",
        display: "flex",
        alignItems: "center",
        padding: 10,
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <h3
          style={{ marginInline: 10, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          חנתרישים{localMode ? " לא קל לי" : ""}
        </h3>
        <span style={{ marginTop: -5 }}>
          {filterAttribute !== null &&
            filterValue !== undefined &&
            `${filterAttribute}: ${filterValue}`}
        </span>
      </div>
      {loading && (
        <>
          <Loader size="sm" ml={5} />
          <span>מתחבר...</span>
        </>
      )}
      {!loading && currentUser !== undefined && currentUser !== null && (
        <>
          <span style={{ overflowX: "auto", display: "flex" }}>
            {(me !== ""
              ? [
                  {
                    title: "דף אישי",
                    url: `/people/${me}`,
                    icon: "home" as FontAwesomeIcon,
                  },
                  ...links,
                ]
              : links
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
