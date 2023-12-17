import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import firebaseConfig from "./firebase.config";
import { getDatabase } from "firebase/database";

const app = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getDatabase(app)

export {app, auth, db};