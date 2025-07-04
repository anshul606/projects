import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzle99Baq5rfXGihyDURzUrV-WWh378o4",
  authDomain: "splitwisee-project.firebaseapp.com",
  projectId: "splitwisee-project",
  storageBucket: "splitwisee-project.firebasestorage.app",
  messagingSenderId: "927559959765",
  appId: "1:927559959765:web:b85b4c89673a590de60e5c",
  measurementId: "G-8TLG9Q1RH9"
};

const loggedIn = localStorage.getItem("loggedIn");

if (loggedIn) {
  window.location.href = "../../main.html";
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const auth = getAuth(app);

const button = document.getElementById("register");

button.addEventListener("click", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    localStorage.setItem("loggedIn", true);
    window.location.href = "../../main.html";
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const errorMessageElement = document.getElementById("error-message");

    // ..
    // errorMessageElement.innerHTML = errorMessage;
  });
});