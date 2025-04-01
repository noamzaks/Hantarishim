import { Badge } from "@mantine/core"
import { useInterval } from "@mantine/hooks"
import { useEffect, useState } from "react"

const Countdown = ({ date }: { date: Date }) => {
  const [now, setNow] = useState(Date.now())
  const interval = useInterval(() => setNow(Date.now()), 1000)

  useEffect(() => {
    interval.start()

    return interval.stop
  })

  if (date.getTime() < now) {
    return <></>
  }

  let hours = (date.getTime() - now) / 1000 / 60 / 60
  let days = Math.floor(hours / 24)
  hours -= days * 24
  hours = Math.floor(hours)

  if (days === 0) {
    return <Badge color="red">עוד {hours} שעות</Badge>
  }

  if (days === 1) {
    return <Badge color="yellow">עוד יום ו-{hours} שעות</Badge>
  }

  return (
    <Badge color="green">
      עוד {days} ימים ו-{hours} שעות
    </Badge>
  )
}

export default Countdown
