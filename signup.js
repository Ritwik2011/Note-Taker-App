import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKjm4R8G6KxnIakoud5EM7mIxf2esXt8Y",
  authDomain: "note-taker-app-aa612.firebaseapp.com",
  projectId: "note-taker-app-aa612",
  storageBucket: "note-taker-app-aa612.firebasestorage.app",
  messagingSenderId: "450633287631",
  appId: "1:450633287631:web:ea54b4b7c56b7377f8f4ba",
  measurementId: "G-2NH0614WC9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("signup-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    alert("Signup successful! Check your email or spam folder to verify your account.");
  } catch (error) {
    alert(error.message);
  }
});