import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, firestore } from "../src/firebase"
import { argv, exit } from "process"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { Course } from "../src/models"

await signInWithEmailAndPassword(auth, argv[2] + "@noamzaks.com", argv[3])
const d = doc(firestore, `/users/${argv[2]}`)
const data = (await getDoc(d)).data()! as Course
console.log(JSON.stringify(data, null, 4))
for (const person in data.people ?? {}) {
    if (!data.people![person].attributes["צוות"]) {
        delete data.people![person]
    }
}
await setDoc(d, data)
exit(0)