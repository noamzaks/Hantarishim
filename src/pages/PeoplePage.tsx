import FontAwesome, { FontAwesomeIcon } from "../components/FontAwesome"
import { getAttributes, useCourse } from "../models"
import LinkButton from "../components/LinkButton"
import React from "react"

const PeoplePage = () => {
  const [course] = useCourse()

  const attributeValues: Record<string, Set<string>> = {}
  for (const person of Object.values(course.people ?? {})) {
    for (const attribute in person.attributes) {
      if (!attributeValues[attribute]) {
        attributeValues[attribute] = new Set()
      }
      attributeValues[attribute].add(person.attributes[attribute])
    }
  }

  return (
    <>
      <h1>אנשים</h1>
      {getAttributes(course)
        .filter((attribute) => course.attributes![attribute].filterable)
        .map((attribute, attributeIndex) => (
          <React.Fragment key={attributeIndex}>
            <h2>
              {course.attributes![attribute].icon !== undefined &&
                course.attributes![attribute].icon !== "" && (
                  <FontAwesome
                    icon={course.attributes![attribute].icon as FontAwesomeIcon}
                    props={{ style: { marginInlineEnd: 10 } }}
                  />
                )}
              {attribute}
            </h2>
            {Array.from(attributeValues[attribute] ?? [])
              .sort()
              .map((attributeValue, attributeValueIndex) => (
                <LinkButton
                  my={5}
                  ml={5}
                  key={attributeValueIndex}
                  color={course.attributes![attribute].color}
                  href={`/people/${attribute}/${attributeValue}`}
                >
                  {attributeValue}
                </LinkButton>
              ))}
          </React.Fragment>
        ))}
    </>
  )
}

export default PeoplePage
