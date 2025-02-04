import { useState, useEffect } from "react"
import { getLocalStorage } from "./utilities"
import { useDocumentData } from "react-firebase-hooks/firestore"
import { doc, setDoc, SetOptions } from "firebase/firestore"
import { firestore } from "../firebase"

export const useLocalStorage = <T>({
  key,
  defaultValue,
}: {
  key: string
  defaultValue?: any
}): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(
    getLocalStorage(key, defaultValue ?? null)
  )

  useEffect(() => {
    if (!localStorage.getItem(key) && defaultValue) {
      localStorage.setItem(key, JSON.stringify(defaultValue))
    }

    const listener = (e: StorageEvent) => {
      if (e.key === key) {
        if (e.newValue) {
          setValue(JSON.parse(e.newValue))
        } else {
          setValue(defaultValue ?? null)
        }
      }
    }

    window.addEventListener("storage", listener)

    return () => window.removeEventListener("storage", listener)
  }, [key])

  const userSetValue = (newValue: any) => {
    setValue(newValue)
    if (typeof newValue === "function") {
      newValue = newValue(getLocalStorage(key, defaultValue ?? null))
    }
    if (newValue !== undefined) {
      localStorage.setItem(key, JSON.stringify(newValue))
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: JSON.stringify(newValue),
        })
      )
    }
  }

  return [value, userSetValue]
}

export const useDocument = (path: string) => {
  const docRef = doc(firestore, path)

  const [data, setData] = useLocalStorage<any>({
    key: "Cached " + docRef.path,
    defaultValue: {},
  })
  const [document, loading, error, snapshot] = useDocumentData(docRef)

  useEffect(() => {
    if (document) {
      setData(document)
    }
  }, [document])

  return {
    data,
    loading,
    error,
    snapshot,
    setData: (data: any, options?: SetOptions) =>
      options ? setDoc(docRef, data, options) : setDoc(docRef, data),
  }
}
