const loggedIn = localStorage.getItem("loggedIn");

if (loggedIn) {
  window.location.href = "./main.html";
}
