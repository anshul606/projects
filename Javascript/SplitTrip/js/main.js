const loggedIn = localStorage.getItem("loggedIn") === "true";

if (!loggedIn) {
  window.location.href = "login.html";
}

const button = document.getElementById("logout");
button.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
});
// otherwise let the page load normally
