// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKDpddDRoXhEumkaAXoaLn4uBZYZfcVRQ",
  authDomain: "benchwarmers-86a43.firebaseapp.com",
  projectId: "benchwarmers-86a43",
  storageBucket: "benchwarmers-86a43.firebasestorage.app",
  messagingSenderId: "77590192030",
  appId: "1:77590192030:web:58e9ebc3052a333029808f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app) 