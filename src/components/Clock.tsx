import { useInterval } from "@mantine/hooks"
import { useEffect, useState } from "react"

const Clock = () => {
  const [time, setTime] = useState(new Date().toTimeString().substring(0, 5))

  const interval = useInterval(
    () => setTime(new Date().toTimeString().substring(0, 5)),
    1000,
  )

  useEffect(() => {
    interval.start()
    return interval.stop
  })

  return time
}

export default Clock
