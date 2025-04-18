import { doc, updateDoc } from "firebase/firestore"
import { createContext, useContext } from "react"
import { auth, firestore } from "./firebase"
import { emailToUsername, getLocalStorage } from "./lib/utilities"

const SORTED_KINDS = ["boolean", "string", "number"]

export interface Person {
  absenceReason?: string
  // The person and time in which the absence reason was updated.
  absenceReasonUpdater?: string
  present: boolean
  // The person and time in which the presence was updated.
  presenceUpdater?: string
  location?: string
  attributes: Record<string, string>
  submitted: string[]
}

export interface Assignment {
  kind: "person" | "attribute" | "group"
  targets: string[]
  name: string
  description: string
  due: string
  attribute?: string
}

export type FormQuestionKind = "scale" | "text"

export interface FormQuestion {
  prompt?: string
  kind?: FormQuestionKind
  required?: boolean
}

export interface Form {
  kind: "person" | "attribute" | "group"
  targets: string[]
  name: string
  attribute?: string
  questions?: FormQuestion[]
}

export interface Attribute {
  icon?: string
  color?: string
  // Whether there should be a page of everyone with the same attribute value (for instance, צוות and not תעודת זהות).
  filterable?: boolean
  // Whether there should be a trash icon in every line of the filter view, to quickly remove the attribute's value (instead of selection).
  quickDeletable?: boolean
  // Whether the attribute should appear as a button near the name.
  isButton?: boolean
  // Sorting value, larger is higher.
  priority?: number
  // Whether the attribute sets a location (for instance, אוטובוס).
  isLocation?: boolean
  /**
   * Attributes which should be initialized automatically based on their (only) value matching the current value of this attribute.
   * For example, the derivative attributes of צוות might be מחלקה.
   */
  derivativeAttributes?: string[]
  // The attribute to sort by initially in filter views
  defaultSort?: string
  kind?: "string" | "number" | "boolean"
}

export interface Course {
  people?: {
    [name: string]: Person
  }
  assignments?: Assignment[]
  forms?: Form[]
  attributes?: {
    [name: string]: Attribute
  }
  groups?: {
    [name: string]: string[]
  }
  locked?: boolean
}

export const CourseContext = createContext<Course>({})

export const useCourse = (): [
  Course,
  (
    updates: any,
    setLoading?: (l: boolean) => void,
  ) => Promise<void> | undefined,
] => [
  useContext(CourseContext),
  async (updates: Record<string, any>, setLoading?: (l: boolean) => void) => {
    setLoading?.(true)
    try {
      const promise = updateDoc(
        doc(firestore, `/users/${emailToUsername(auth.currentUser!.email!)}`),
        updates,
      )
        .then(() => setLoading?.(false))
        .catch(() => setLoading?.(false))
      if (!getLocalStorage("Local Mode", false)) {
        await promise
      } else {
        setLoading?.(false)
      }
    } catch (ignored) {
      setLoading?.(false)
    }
  },
]

export const getAttributes = (course: Course) => {
  if (!course) {
    return []
  }

  return Object.keys(course.attributes ?? {}).sort((a, b) => {
    const infoA = course.attributes![a]
    const infoB = course.attributes![b]
    const kindA = infoA.kind ?? "string"
    const kindB = infoB.kind ?? "string"
    if (kindA !== kindB) {
      return SORTED_KINDS.indexOf(kindA) - SORTED_KINDS.indexOf(kindB)
    }

    if (infoA.filterable && !infoB.filterable) {
      return -1
    } else if (infoB.filterable && !infoA.filterable) {
      return 1
    }

    const priorityA = infoA.priority
    const priorityB = infoB.priority
    if (priorityA && priorityB) {
      return priorityB - priorityA
    } else if (priorityA) {
      return -1
    } else if (priorityB) {
      return 1
    }

    return a.localeCompare(b)
  })
}

export const CourseLoadingContext = createContext(false)

export const useCourseLoading = () => useContext(CourseLoadingContext)

export const getPeopleForAttribute = (
  course: Course,
  attribute: string,
  attributeValue: string,
) => {
  let result = Object.keys(course.people ?? {})
    .filter(
      (personName) =>
        course.people![personName].attributes[attribute] === attributeValue,
    )
    .sort()

  const filterAttribute = getLocalStorage("Filter Attribute", null) as
    | string
    | null
  const filterValue = getLocalStorage("Filter Value", null) as string | null
  if (filterAttribute && filterValue) {
    result = result.filter(
      (personName) =>
        course.people![personName].attributes[filterAttribute] === filterValue,
    )
  }

  return result
}
