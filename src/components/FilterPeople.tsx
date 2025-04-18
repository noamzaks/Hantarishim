import { Autocomplete, Fieldset, Select } from "@mantine/core"
import { useLocalStorage } from "../lib/hooks"
import { getAttributes, useCourse } from "../models"

const FilterPeople = () => {
  const [filterAttribute, setFilterAttribute] = useLocalStorage<string | null>({
    key: "Filter Attribute",
    defaultValue: null,
  })
  const [filterValue, setFilterValue] = useLocalStorage<string | undefined>({
    key: "Filter Value",
    defaultValue: undefined,
  })
  const [course] = useCourse()

  return (
    <Fieldset
      legend="סינון (מציג רק מטלות וקבוצות אנשים עם אנשים לפי הסינון)"
      display="flex"
      my="xs"
    >
      <Select
        clearable
        data={getAttributes(course).filter(
          (attribute) => course.attributes![attribute].filterable,
        )}
        w="47.5%"
        ml="5%"
        value={filterAttribute}
        onChange={setFilterAttribute}
      />
      <Autocomplete
        w="47.5%"
        data={
          filterAttribute
            ? [
                ...new Set(
                  Object.keys(course.people ?? {}).map(
                    (person) =>
                      course.people![person].attributes[filterAttribute],
                  ),
                ),
              ]
                .filter((x) => x !== undefined && x !== "")
                .sort()
            : []
        }
        value={filterValue}
        onChange={setFilterValue}
      />
    </Fieldset>
  )
}

export default FilterPeople
