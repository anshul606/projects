import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "../firebase.js";                 // ← single source of truth

/* Auto‑redirect if already logged in */
onAuthStateChanged(auth, user => {
  if (user) location.href = "main.html";
  else      document.body.classList.remove("precheck");
});

/* FORM HANDLER */
const form = document.querySelector("#login-form");
const errorBox = document.querySelector("#error-message");

form.addEventListener("submit", async e => {
  e.preventDefault();
  errorBox.textContent = "";

  const email    = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    errorBox.textContent = "Please enter both e‑mail and password";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will redirect on success
  } catch (err) {
    console.error(err.code);
    errorBox.textContent = humanMessage(err.code);
  }
});

function humanMessage(code) {
  switch (code) {
    case "auth/invalid-email":  return "That e‑mail looks wrong.";
    case "auth/user-not-found": return "No account with that e‑mail.";
    case "auth/wrong-password": return "Incorrect password.";
    default:                    return "Login failed: " + code;
  }
}
