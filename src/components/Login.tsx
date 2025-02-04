import { Button, PasswordInput, TextInput } from "@mantine/core"
import FontAwesome from "./FontAwesome"
import { useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "../firebase"
import { showError, usernameToEmail } from "../lib/utilities"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loggingIn, setLoggingIn] = useState(false)
  const [signingUp, setSigningUp] = useState(false)

  const login = () => {
    setLoggingIn(true)
    signInWithEmailAndPassword(auth, usernameToEmail(username), password)
      .then(() => setLoggingIn(false))
      .catch((e) => {
        setLoggingIn(false)
        showError(
          "שגיאה בהתחברות",
          `קוד השגיאה: ${e.code}. אנא בדקו את הפרטים ונסו שוב.`
        )
      })
  }

  const signUp = () => {
    setSigningUp(true)
    createUserWithEmailAndPassword(auth, usernameToEmail(username), password)
      .then(() => setSigningUp(false))
      .catch((e) => {
        setSigningUp(false)
        showError(
          "שגיאה ביצירת המשתמש",
          `קוד השגיאה: ${e.code}. ייתכן ששם המשתמש תפוס.`
        )
      })
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 400,
          maxWidth: "100%",
        }}
      >
        <h1>התחברות</h1>
        <TextInput
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          w="100%"
          label="שם משתמש"
          leftSection={<FontAwesome icon="user" />}
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              login()
            }
          }}
          w="100%"
          mt="xs"
          label="סיסמה"
          leftSection={<FontAwesome icon="lock" />}
        />
        <Button.Group mt="md" w="100%">
          <Button
            w="50%"
            leftSection={<FontAwesome icon="right-to-bracket" />}
            onClick={login}
            loading={loggingIn}
          >
            התחבר/י
          </Button>
          <Button
            w="50%"
            leftSection={<FontAwesome icon="user-plus" />}
            onClick={signUp}
            loading={signingUp}
          >
            הירשמ/י
          </Button>
        </Button.Group>
      </div>
    </div>
  )
}

export default Login
