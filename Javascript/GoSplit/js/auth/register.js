import { auth } from "../firebase.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// After sign up
await setDoc(doc(db, "users", user.uid), {
  email: user.email,
  name: user.displayName || "", // optional
});

/* Redirect if already logged in */
onAuthStateChanged(auth, user => {
  if (user) location.href = "../main.html";
  else      document.body.classList.remove("precheck");
});

const form      = document.querySelector("#register-form");
const errorBox  = document.querySelector("#error-message");

form.addEventListener("submit", async e => {
  e.preventDefault();
  errorBox.textContent = "";

  const email    = form.email.value.trim();
  const password = form.password.value;
  const confirm  = form.confirm.value;

  if (password !== confirm) {
    errorBox.textContent = "Passwords do not match.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // listener redirects on success
  } catch (err) {
    errorBox.textContent = friendlyErr(err.code);
  }
});

function friendlyErr(code) {
  if (code === "auth/email-already-in-use") return "That e‑mail is already registered.";
  if (code === "auth/weak-password")        return "Password should be at least 6 characters.";
  return "Signup failed: " + code;
}
