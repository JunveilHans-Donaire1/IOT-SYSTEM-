import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAVreFOYRtqKaL_VESYJNyOFuU9wK5UTt8",
  authDomain: "smartbin-15f08.firebaseapp.com",
  databaseURL: "https://smartbin-15f08-default-rtdb.firebaseio.com",
  projectId: "smartbin-15f08",
  storageBucket: "smartbin-15f08.appspot.com", // ✅ FIXED
  messagingSenderId: "398914380936",
  appId: "1:398914380936:web:66e85bf417a931f024ab3d"
};

// Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
