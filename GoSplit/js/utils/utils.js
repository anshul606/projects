export function getProfileImage() {
    const profileImage = `assets/profile_images/profile-${Math.floor(Math.random()*10)}.jpg`;
    localStorage.setItem("profileImage", profileImage);
}

