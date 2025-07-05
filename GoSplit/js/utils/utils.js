export function getProfileImage() {
    const profileImage = `assets/profile_images/profile-${Math.floor(Math.random()*10) + 1}.jpg`;
    localStorage.setItem("profileImage", profileImage);
}

