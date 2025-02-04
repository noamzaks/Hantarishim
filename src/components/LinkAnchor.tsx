import { Anchor, AnchorProps, PolymorphicComponentProps } from "@mantine/core"
import { useNavigate } from "react-router-dom"

const LinkAnchor = (props: PolymorphicComponentProps<"a", AnchorProps>) => {
  const navigate = useNavigate()

  return (
    <Anchor
      onClick={(e) => {
        e.preventDefault()
        if (props.href) {
          navigate(props.href)
        }
      }}
      {...props}
    />
  )
}

export default LinkAnchor
