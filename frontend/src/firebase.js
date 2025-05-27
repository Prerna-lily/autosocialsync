// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS1_mll7YCEf-71dqw854Rkq9sRpm4oFo",
  authDomain: "socialsyncc-e0a04.firebaseapp.com",
  projectId: "socialsyncc-e0a04",
  storageBucket: "socialsyncc-e0a04.appspot.com", // ✅ fixed typo: was .firebasestorage.app (incorrect)
  messagingSenderId: "227656803806",
  appId: "1:227656803806:web:2fe88a210237bb0500294f",
  measurementId: "G-HKGRFGPN7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialize Firestore
const db = getFirestore(app);

// ✅ Export db
export { db };
