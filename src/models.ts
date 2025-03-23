import { doc, setDoc, updateDoc } from "firebase/firestore"
import { createContext, useContext } from "react"
import { auth, firestore } from "./firebase"
import { emailToUsername } from "./lib/utilities"

export interface Person {
  absenceReason?: string
  present: boolean
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

export interface Attribute {
  icon?: string
  color?: string
  // Whether there should be a page of everyone with the same attribute value (for instance, צוות and not תעודת זהות).
  filterable?: boolean
  // Whether the attribute is a number
  isNumber?: boolean
  // Sorting value, larger is higher.
  priority?: number
  /**
   * Attributes which should be initialized automatically based on their (only) value matching the current value of this attribute.
   * For example, the derivative attributes of צוות might be מחלקה.
   */
  derivativeAttributes?: string[]
}

export interface Course {
  people?: {
    [name: string]: Person
  }
  assignments?: Assignment[]
  attributes?: {
    [name: string]: Attribute
  }
  groups?: {
    [name: string]: string[]
  }
}

export const CourseContext = createContext<Course>({})

export const useCourse = (): [
  Course,
  (
    d: Course,
    setLoading?: (l: boolean) => void,
    merge?: boolean,
  ) => Promise<void> | undefined,
  (
    updates: any,
    setLoading?: (l: boolean) => void,
  ) => Promise<void> | undefined,
] => [
  useContext(CourseContext),
  (d: Course, setLoading?: (l: boolean) => void, merge = true) => {
    setLoading?.(true)
    try {
      return setDoc(
        doc(firestore, `/users/${emailToUsername(auth.currentUser!.email!)}`),
        d,
        { merge },
      )
        .then(() => setLoading?.(false))
        .catch(() => setLoading?.(false))
    } catch (ignored) {
      setLoading?.(false)
    }
  },
  (updates: any, setLoading?: (l: boolean) => void) => {
    setLoading?.(true)
    try {
      return updateDoc(
        doc(firestore, `/users/${emailToUsername(auth.currentUser!.email!)}`),
        updates,
      )
        .then(() => setLoading?.(false))
        .catch(() => setLoading?.(false))
    } catch (ignored) {
      setLoading?.(false)
    }
  },
]

export const getAttributes = (course: Course) => {
  return Object.keys(course.attributes ?? {}).sort((a, b) => {
    const infoA = course.attributes![a]
    const infoB = course.attributes![b]
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
