// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDKjm4R8G6KxnIakoud5EM7mIxf2esXt8Y",
    authDomain: "note-taker-app-aa612.firebaseapp.com",
    projectId: "note-taker-app-aa612",
    storageBucket: "note-taker-app-aa612.firebasestorage.app",
    messagingSenderId: "450633287631",
    appId: "1:450633287631:web:ea54b4b7c56b7377f8f4ba",
    measurementId: "G-2NH0614WC9"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

// my code
const submit = document.getElementById('signup-btn');

submit.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        alert("Creating Account...")
        window.location.href = "index2.html";
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
        // ..
    });
});