import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
  query,
  where,
  getDocs,
  or,
  onSnapshot, // ← Firestore v11 supports or()
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { openTrip } from "./trip.js";
import {
  collectionGroup, FieldPath,
  updateDoc, arrayUnion, documentId
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


let currentTrip = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "login.html"; // not signed in
    return;
  }
  initApp(user); // proceed when signed in
});

function getInviteToken() {
  const params = new URLSearchParams(location.search);
  return params.get("invite");
}

async function acceptInviteIfPresent(user) {
  // ----- NEW: parse ?invite=tripId_token -----
  const inviteParam = new URLSearchParams(location.search).get("invite");
  if (!inviteParam) return;                // no invite in URL

  const [tripId, token] = inviteParam.split("_");
  if (!tripId || !token) return;           // malformed link

  // Full document path required by documentId()
  const invitePath = `trips/${tripId}/invites/${token}`;

  // ----- NEW: build query with full path -----
  const inviteQuery = query(
    collectionGroup(db, "invites"),
    where(documentId(), "==", invitePath)
  );

  const snap = await getDocs(inviteQuery);
  if (snap.empty) {
    alert("Invalid or expired invite.");
    return;
  }

  // (the rest of your original logic stays unchanged ↓)
  const inviteDoc = snap.docs[0];
  const { expiresAt } = inviteDoc.data();
  if (expiresAt < Date.now()) {
    alert("Invite expired.");
    return;
  }

  // add user to trip members
  const tripRef = doc(db, "trips", tripId);
  await updateDoc(tripRef, {
    members: arrayUnion(user.uid)
  });

  await deleteDoc(inviteDoc.ref);          // optional clean‑up

  // Clean URL and open the trip
  const url = new URL(location);
  url.searchParams.delete("invite");
  history.replaceState({}, "", url);

  location.hash = tripId;                  // triggers loadTripFromHash()
}


onAuthStateChanged(auth, async user => {
  if (!user) { location.href = "login.html"; return; }
  await acceptInviteIfPresent(user);
  initApp(user);
});



/* -------  APP START  ------- */
function initApp(user) {
  /* 1.  PROFILE PIC */
  const fallback = "assets/profile_images/profile-1.png";
  const profileImage = localStorage.getItem("profileImage") || fallback;

  document.querySelectorAll(".profile-image").forEach((div) => {
    div.innerHTML = `<img src="${profileImage}" width="40" style="border-radius:50%">`;
  });

  /* 2.  LOGOUT */
  document.getElementById("logout").addEventListener("click", () => {
    signOut(auth);
  });

  /* 3.  NAV + DEFAULT SECTION */
  const sidebar = {
    init() {
      document
        .querySelectorAll(".nav-item")
        .forEach((item) => item.addEventListener("click", sidebar.tab));
    },
    tab() {
      document
        .querySelector(".nav-item-checked")
        ?.classList.remove("nav-item-checked");
      this.classList.add("nav-item-checked");

      document
        .querySelector(".content-item_active")
        ?.classList.remove("content-item_active");
      document
        .getElementById(this.dataset.id)
        .classList.add("content-item_active");
    },
  };
  loadTripFromHash(); // initial check
  window.addEventListener("hashchange", loadTripFromHash); // any future hash changes

  sidebar.init();

  fetchAndRenderUserTrips(user.uid);
}

async function fetchAndRenderUserTrips(uid) {
  // query: trips where createdBy == uid OR members array-contains uid
  const tripsCol = collection(db, "trips");
  const q = query(
    tripsCol,
    or(where("createdBy", "==", uid), where("members", "array-contains", uid))
  );

  // one‑off fetch (change to onSnapshot(q, snap => …) for realtime)
  const snap = await getDocs(q);

  const listEl = document.getElementById("trips-list");
  const emptyMsg = document.getElementById("no-trips-msg");
  listEl.innerHTML = ""; // clear old

  if (snap.empty) {
    emptyMsg.classList.remove("hidden");
    return;
  }
  emptyMsg.classList.add("hidden");

  snap.forEach((docSnap) => {
    const trip = docSnap.data();
    const tripId = docSnap.id;
    const isOwner = trip.createdBy === uid;

    const li = document.createElement("li");
    li.innerHTML = `
    <li class="trip-card">
      <span class="trip-name">${trip.name}</span>
      <div class="trip-actions">
        <button class="trip-link open-btn" data-id="${tripId}">Open</button>
        ${
          isOwner
            ? `<button class="delete-trip delete-btn" data-id="${tripId}">Delete</button>`
            : ""
        }
      </div>
    </li>
  `;
    listEl.appendChild(li);
  });

  // Delegate all clicks to list
  listEl.addEventListener("click", async (e) => {
    const tripBtn = e.target.closest(".trip-link");
    const deleteBtn = e.target.closest(".delete-trip");

    if (tripBtn) {
      location.hash = tripBtn.dataset.id;
      return;
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      if (!confirm("Are you sure you want to delete this trip?")) return;

      try {
        await deleteDoc(doc(db, "trips", id));
        if (location.hash.slice(1) === id) {
          location.hash = "";
          currentTrip = null;
        }
        fetchAndRenderUserTrips(uid); // Refresh list
      } catch (err) {
        console.error(err);
        alert("Failed to delete trip.");
      }
    }
  });

  // delegate click to list
  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".trip-link");
    if (!btn) return;
    location.hash = btn.dataset.id; // triggers loadTripFromHash()
  });
}

document.getElementById("create-trip").addEventListener("click", async () => {
  const tripName = document.getElementById("trip-name").value.trim();
  if (!tripName) return alert("Trip name required!");

  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  const tripData = {
    name: tripName,
    createdBy: user.uid,
    members: [user.uid],
    createdAt: Date.now(),
  };

  const createdTrip = document.getElementById("created-trip");

  createdTrip.innerHTML = `Trip <strong>${tripName}</strong> created!`;

  const docRef = await addDoc(collection(db, "trips"), tripData);

  // Redirect to trip using hash
  window.location.hash = docRef.id;
});

async function loadTripFromHash() {
  const hash = location.hash.slice(1);
  if (!hash) {
    currentTrip = null;
    return;
  }

  const user = auth.currentUser;
  if (!user) return; // should never happen after auth check

  const tripRef = doc(db, "trips", hash);
  const tripSnap = await getDoc(tripRef);

  if (!tripSnap.exists()) {
    alert("Trip not found!");
    currentTrip = null;
    return;
  }

  const trip = { id: hash, ...tripSnap.data() };

  /* 🚧 membership check */
  const isMember =
    trip.members?.includes(user.uid) || trip.createdBy === user.uid;

  if (!isMember) {
    currentTrip = null;
    location.hash = ""; // return user to dashboard hashless
  } else {
    currentTrip = trip;
  }

  currentTrip = trip;
  openTrip(trip);
}

if (!location.hash) {
  document.querySelector(".nav-item[data-id='dashboard']")?.click();
}
