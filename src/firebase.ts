import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { initializeFirestore, persistentLocalCache } from "firebase/firestore"

const app = initializeApp({
  apiKey: "AIzaSyA8a6gs3vEYVcZosWjGOG-IkpnVDDusV0Y",
  authDomain: "hantarishim.firebaseapp.com",
  projectId: "hantarishim",
  storageBucket: "hantarishim.firebasestorage.app",
  messagingSenderId: "1016394084272",
  appId: "1:1016394084272:web:a4c272c374a71784927075",
})

export const auth = getAuth(app)
export const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})
