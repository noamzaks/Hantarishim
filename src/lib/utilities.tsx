import { notifications } from "@mantine/notifications"
import FontAwesome from "../components/FontAwesome"

export const usernameToEmail = (username: string) => username + "@noamzaks.com"
export const emailToUsername = (email: string) => email.split("@")[0]

export const getLocalStorage = (key: string, defaultValue = {}) => {
  return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultValue))
}

export const setLocalStorage = (key: string, value = {}) => {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(
    new StorageEvent("storage", { key, newValue: JSON.stringify(value) })
  )
}

export const showError = (title: string, message: string) => {
  notifications.show({
    title,
    message,
    color: "red",
    icon: <FontAwesome icon="xmark" />,
  })
}

export const downloadFile = (
  filename: string,
  mimeType: string,
  contents: string
) => {
  const a = document.createElement("a")
  a.style.display = "none"
  document.body.appendChild(a)
  a.href = `data:${mimeType};charset=utf-8,${encodeURIComponent(contents)}`
  a.download = filename
  a.click()
  document.body.removeChild(a)
}
