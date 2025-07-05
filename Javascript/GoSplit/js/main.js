const loggedIn = localStorage.getItem("loggedIn") === "true";

const profileImage = localStorage.getItem("profileImage");

const profileImageElement = document.getElementById("profile-image");

if (!loggedIn) {
  window.location.href = "login.html";
}

const button = document.getElementById("logout");
button.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
});
// otherwise let the page load normally

const sidebar = {
  init() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => item.addEventListener("click", sidebar.tab));
  },

  tab() { 
    const activeNav = document.querySelector(".nav-item-checked");
    if (activeNav) activeNav.classList.remove("nav-item-checked");
    this.classList.add("nav-item-checked");

    const activeContent = document.querySelector(".content-item_active");
    if (activeContent) activeContent.classList.remove("content-item_active");
    document.getElementById(this.dataset.id).classList.add("content-item_active");
  }
};

sidebar.init();



