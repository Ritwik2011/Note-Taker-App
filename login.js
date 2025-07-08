import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
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

document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await sendEmailVerification(user);
      alert("Email not verified. Verification email resent. Please check your inbox or spam folder.");
      await auth.signOut();
      return;
    }

    window.location.href = "index2.html";

  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

document.getElementById("reset-btn").addEventListener("click", async () => {
  const email = prompt("Enter your email to reset password:");
  if (!email) {
    alert("Email is required to reset password.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent. Please check your inbox or spam folder.");
  } catch (error) {
    console.error("Password reset error:", error.code, error.message);
    if (error.code === "auth/user-not-found") {
      alert("No user found with this email. Please sign up first.");
    } else if (error.code === "auth/invalid-email") {
      alert("The email address is invalid.");
    } else {
      alert("Error sending password reset email: " + error.message);
    }
  }
});
