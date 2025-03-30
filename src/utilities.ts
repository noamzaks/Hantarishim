import { getLocalStorage } from "./lib/utilities"

export const pad = (s: string, l: number) => {
  return s.padStart(l, "0")
}

export const getUpdater = () => {
  const me = getLocalStorage("Me", "")
  const now = new Date()
  const dateString = `${pad(now.getHours().toString(), 2)}:${pad(now.getMinutes().toString(), 2)}`

  if (me === "") {
    return dateString
  }
  return `${me} (${dateString})`
}
