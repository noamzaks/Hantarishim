import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, firestore } from "../src/firebase"
import { argv, exit } from "process"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { Course } from "../src/models"
import { readFileSync } from "fs"

await signInWithEmailAndPassword(auth, argv[2] + "@noamzaks.com", argv[3])
const d = doc(firestore, `/users/${argv[2]}`)
const data = JSON.parse(readFileSync(argv[4], "utf-8"))
await setDoc(d, data)
exit(0)
