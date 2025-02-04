import { Button, ButtonProps } from "@mantine/core"
import { useNavigate } from "react-router-dom"

const LinkButton = (props: ButtonProps & { href: string }) => {
  const navigate = useNavigate()

  return (
    <Button
      component="a"
      onClick={(e) => {
        e.preventDefault()
        navigate(props.href)
      }}
      {...props}
    />
  )
}

export default LinkButton
