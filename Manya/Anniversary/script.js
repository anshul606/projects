document.addEventListener("DOMContentLoaded", function () {
  // Initialize all interactive features
  initCountdown();
  initMessageInBottle();
  initGalleryAnimation();
  initMusicPlayer();

  // Add scroll animations
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Initial check
});

// Countdown Timer
function initCountdown() {
  // Set the date for next anniversary (1 year from now)
  const today = new Date();
  const nextAnniversary = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate()
  );

  function updateCountdown() {
    const currentTime = new Date();
    const diff = nextAnniversary - currentTime;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }

  // Update the countdown every second
  setInterval(updateCountdown, 1000);
  updateCountdown(); // Initial update
}

// Message in a Bottle Feature with Global Messages
function initMessageInBottle() {
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-message");
  const deleteButton = document.getElementById("delete-all-messages");
  const messageDisplay = document.getElementById("message-display");
  const bottle = document.querySelector(".bottle");

  // Add Firebase SDK
  const firebaseScript = document.createElement("script");
  firebaseScript.src =
    "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
  document.head.appendChild(firebaseScript);

  const firebaseDatabaseScript = document.createElement("script");
  firebaseDatabaseScript.src =
    "https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js";
  document.head.appendChild(firebaseDatabaseScript);

  // Initialize Firebase once scripts are loaded
  firebaseDatabaseScript.onload = function () {
    // Your Firebase configuration - REPLACE WITH YOUR OWN CONFIG
    const firebaseConfig = {
      apiKey: "AIzaSyBMVfdMVyOgG-nzNGwzpLTGe2apTPhutfs",
      authDomain: "portfolio-mainxd.firebaseapp.com",
      databaseURL:
        "https://portfolio-mainxd-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "portfolio-mainxd",
      storageBucket: "portfolio-mainxd.firebasestorage.app",
      messagingSenderId: "668892790110",
      appId: "1:668892790110:web:8307b6ed05c78d9edd63cf",
      measurementId: "G-9963FBWNQR",
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the database service
    const database = firebase.database();
    const messagesRef = database.ref("anniversary-messages");

    // Load messages from Firebase
    loadMessages();

    // Listen for new messages
    messagesRef.on("value", (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push(childSnapshot.val());
      });
      displayMessages(messages);
    });

    // Send button event listener
    sendButton.addEventListener("click", function () {
      if (messageInput.value.trim() !== "") {
        // Save the message to Firebase
        saveMessage(messageInput.value);

        // Clear the input
        messageInput.value = "";

        // Animate the bottle
        bottle.classList.add("shake");
        setTimeout(() => {
          bottle.classList.remove("shake");
        }, 1000);
      }
    });

    // Delete all messages button event listener
    deleteButton.addEventListener("click", function () {
      if (confirm("Are you sure you want to delete all messages? This cannot be undone.")) {
        deleteAllMessages();

        // Animate the bottle for deletion
        bottle.classList.add("shake-delete");
        setTimeout(() => {
          bottle.classList.remove("shake-delete");
        }, 1000);
      }
    });

    function saveMessage(message) {
      // Push a new message to the Firebase database
      messagesRef.push({
        text: message,
        date: new Date().toLocaleString(),
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      });
    }

    function deleteAllMessages() {
      // Remove all messages from Firebase
      messagesRef.remove()
        .then(() => {
          console.log("All messages deleted successfully");
          displayMessages([]);
        })
        .catch((error) => {
          console.error("Error deleting messages: ", error);
          alert("Error deleting messages. Please try again.");
        });
    }

    function loadMessages() {
      // Messages are loaded through the 'value' event listener above
      messagesRef
        .orderByChild("timestamp")
        .limitToLast(10)
        .once("value", (snapshot) => {
          const messages = [];
          snapshot.forEach((childSnapshot) => {
            messages.push(childSnapshot.val());
          });
          displayMessages(messages);
        });
    }
  };

  function displayMessages(messages) {
    if (!messages || messages.length === 0) {
      messageDisplay.innerHTML =
        '<p class="empty-message">No messages yet 😒</p>';
      return;
    }

    messageDisplay.innerHTML = "";
    messages.forEach((msg) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.innerHTML = `
                <p class="message-text">${msg.text}</p>
                <p class="message-date">${msg.date}</p>
            `;
      messageDisplay.appendChild(messageElement);
    });
  }

  // Add shake animation
  document.head.insertAdjacentHTML(
    "beforeend",
    `
        <style>
            @keyframes shake {
                0% { transform: translateY(0) rotate(0); }
                25% { transform: translateY(-10px) rotate(-5deg); }
                50% { transform: translateY(0) rotate(0); }
                75% { transform: translateY(-10px) rotate(5deg); }
                100% { transform: translateY(0) rotate(0); }
            }
            
            @keyframes shake-delete {
                0% { transform: translateY(0) rotate(0); filter: hue-rotate(0deg); }
                25% { transform: translateY(-10px) rotate(-10deg); filter: hue-rotate(180deg); }
                50% { transform: translateY(0) rotate(0); filter: hue-rotate(0deg); }
                75% { transform: translateY(-10px) rotate(10deg); filter: hue-rotate(180deg); }
                100% { transform: translateY(0) rotate(0); filter: hue-rotate(0deg); }
            }
            
            .bottle.shake {
                animation: shake 1s ease;
            }
            
            .bottle.shake-delete {
                animation: shake-delete 1s ease;
            }
            
            .message {
                background-color: rgba(255, 255, 255, 0.2);
                padding: 10px;
                border-radius: 10px;
                margin-bottom: 10px;
            }
            
            .message-text {
                font-size: 1.1rem;
                margin-bottom: 5px;
            }
            
            .message-date {
                font-size: 0.8rem;
                text-align: right;
                color: rgba(255, 255, 255, 0.7);
            }
            
            .empty-message {
                font-style: italic;
                color: rgba(255, 255, 255, 0.7);
            }
        </style>
    `
  );
}

// Gallery Animation
function initGalleryAnimation() {
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item, index) => {
    // Add delay to stagger the animations
    item.style.animationDelay = `${index * 0.2}s`;

    // Add hover effect
    item.addEventListener("mouseenter", function () {
      this.style.zIndex = "1";
    });

    item.addEventListener("mouseleave", function () {
      this.style.zIndex = "0";
    });
  });

  // Add gallery animation styles
  document.head.insertAdjacentHTML(
    "beforeend",
    `
        <style>
            .gallery-item {
                opacity: 0;
                transform: translateY(20px);
                animation: fadeInUp 0.5s ease forwards;
            }
            
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `
  );
}

// Scroll Reveal Animation
function revealOnScroll() {
  const sections = document.querySelectorAll("section");
  const windowHeight = window.innerHeight;

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const revealPoint = 150;

    if (sectionTop < windowHeight - revealPoint) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });

  // Add scroll reveal styles
  document.head.insertAdjacentHTML(
    "beforeend",
    `
        <style>
            section {
                opacity: 0;
                transform: translateY(50px);
                transition: opacity 1s ease, transform 1s ease;
            }
            
            section.active {
                opacity: 1;
                transform: translateY(0);
            }
        </style>
    `
  );
}

// Add confetti effect on page load
function createConfetti() {
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti-container";
  document.body.appendChild(confettiContainer);

  const colors = ["#ff85a2", "#c9abff", "#fff", "#ffb6c1", "#ffd700"];

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
    confetti.style.animationDelay = Math.random() * 5 + "s";
    confettiContainer.appendChild(confetti);
  }

  // Add confetti styles
  document.head.insertAdjacentHTML(
    "beforeend",
    `
        <style>
            .confetti-container {
                position: fixed;
                top: -20px;
                left: 0;
                width: 100%;
                height: 100vh;
                z-index: 100;
                pointer-events: none;
            }
            
            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                opacity: 0;
                animation: confetti-fall linear infinite, confetti-shake 3s ease-in-out infinite;
            }
            
            @keyframes confetti-fall {
                0% {
                    opacity: 1;
                    top: -20px;
                    transform: rotateZ(0deg);
                }
                100% {
                    opacity: 0;
                    top: 100vh;
                    transform: rotateZ(360deg);
                }
            }
            
            @keyframes confetti-shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(100px); }
                50% { transform: translateX(-100px); }
                75% { transform: translateX(50px); }
                100% { transform: translateX(0); }
            }
        </style>
    `
  );
}

// Initialize Music Player
function initMusicPlayer() {
  const songSelector = document.getElementById('song-selector');
  const audioPlayer = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const stopBtn = document.getElementById('stop-btn');
  const currentSongTitle = document.getElementById('current-song-title');
  const musicNotes = document.querySelectorAll('.music-note');

  // Song selection change event
  songSelector.addEventListener('change', function() {
    if (this.value) {
      // Set the audio source to the selected song
      audioPlayer.src = this.value;
      
      // Update the current song title
      const selectedOption = this.options[this.selectedIndex];
      currentSongTitle.textContent = "Now Playing: " + selectedOption.text;
      
      // Play the song
      audioPlayer.play()
        .then(() => {
          // Activate music notes animation
          activateMusicNotes(true);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          currentSongTitle.textContent = "Error playing song. Please try again.";
        });
    }
  });

  // Play button event
  playBtn.addEventListener('click', function() {
    if (audioPlayer.src) {
      audioPlayer.play()
        .then(() => {
          activateMusicNotes(true);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
        });
    } else {
      currentSongTitle.textContent = "Please select a song first";
    }
  });

  // Pause button event
  pauseBtn.addEventListener('click', function() {
    if (audioPlayer.src) {
      audioPlayer.pause();
      activateMusicNotes(false);
    }
  });

  // Stop button event
  stopBtn.addEventListener('click', function() {
    if (audioPlayer.src) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      activateMusicNotes(false);
    }
  });

  // Audio ended event
  audioPlayer.addEventListener('ended', function() {
    activateMusicNotes(false);
    currentSongTitle.textContent = "Song ended. Select another or play again.";
  });

  // Function to activate or deactivate music notes animation
  function activateMusicNotes(activate) {
    musicNotes.forEach(note => {
      if (activate) {
        note.style.animationPlayState = 'running';
        note.style.opacity = '1';
      } else {
        note.style.animationPlayState = 'paused';
        note.style.opacity = '0';
      }
    });
  }

  // Initially pause the music notes animation
  activateMusicNotes(false);
}

// Create confetti effect
createConfetti();

// Add a special message when the page is about to be closed
window.addEventListener("beforeunload", function (e) {
  const message = "Thank you for celebrating our anniversary! I love you!";
  e.returnValue = message;
  return message;
});
