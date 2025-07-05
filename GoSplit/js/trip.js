/* js/trip.js
 * One place for ALL trip‑specific logic.
 * Expand this as you build: add‑expense, add‑member, split math…
 */
import { auth, db } from "./firebase.js";
import {
  doc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { nanoid } from "https://cdn.skypack.dev/nanoid"; // tiny id helper

/* Keep the trip object in here */
let currentTrip = null;

/* — new DOM refs — */
const membersList = document.getElementById("members-list");
const memberCountEl = document.getElementById("member-count");

/* Called from main.js when hash loads */
export function openTrip(trip) {
  currentTrip = trip;
  document.getElementById("trip-title").textContent = trip.name;

  renderMembers(trip.members || [], trip.membersInfo || []);      // ← new line

  document.querySelector('.nav-item[data-id="tripview"]')?.click();

  liveExpenseFeed(trip.id, trip.membersInfo || []);
}


/* Live expense listener */
function liveExpenseFeed(tripId, membersInfo) {
  const q = query(
    collection(db, "trips", tripId, "expenses"),
    orderBy("createdAt", "desc")
  );
  onSnapshot(q, snap => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderExpenses(list, membersInfo);
  });
}


/* Render expense list */
function renderExpenses(arr, membersInfo) {
  const uidToName = {};
  membersInfo.forEach(m => {
    uidToName[m.uid] = m.emailPrefix || m.uid.slice(0,6) + "…";
  });

  const ul = document.getElementById("expense-list");
  ul.innerHTML = "";
  if (!arr.length) {
    document.getElementById("no-expense-msg").classList.remove("hidden");
    return;
  }
  document.getElementById("no-expense-msg").classList.add("hidden");

  arr.forEach(exp => {
    const payerName = uidToName[exp.payer] || "Anon";
    const li = document.createElement("li");
    li.className = "expense-item";
    li.innerHTML = `
      <div>⚫️ &nbsp;&nbsp;${exp.description}
        <span class="expense-user">by ${payerName}</span>
        
      </div>
      <span class="amount">₹${exp.amount}</span>
    `;
    ul.appendChild(li);
  });
}



function renderMembers(list, infoList){
  membersList.innerHTML = "";

  // Build a map uid → label
  const labelMap = {};
  (infoList || []).forEach(o => labelMap[o.uid] = o.emailPrefix);

  list.forEach(uid => {
    const label = labelMap[uid] || uid.slice(0,6) + "…";
    membersList.insertAdjacentHTML("beforeend",`
      <li class="member-badge">
        <img src="assets/profile_images/profile-${Math.floor(Math.random()*10)}.jpg">
        ${label}
      </li>
    `);
  });
  memberCountEl.textContent = list.length;
}



/* Add‑expense button */
document
  .getElementById("add-expense-btn")
  .addEventListener("click", async () => {
    if (!currentTrip) return;

    const desc = document.getElementById("expense-desc").value.trim();
    const amt = Number(document.getElementById("expense-amount").value);

    if (!desc || !amt) return alert("Need description and amount");

    await addDoc(collection(db, "trips", currentTrip.id, "expenses"), {
      description: desc,
      amount: amt,
      payer: auth.currentUser.uid,
      payerName: auth.currentUser.displayName || "Anon",
      createdAt: Date.now(),
    });

    document.getElementById("expense-desc").value = "";
    document.getElementById("expense-amount").value = "";
  });

document
  .getElementById("generate-invite")
  .addEventListener("click", async () => {
    if (!currentTrip) return;
    if (auth.currentUser.uid !== currentTrip.createdBy) {
      return alert("Only owner can invite.");
    }

    const token = nanoid(10); // random string
    const inviteParam = `${currentTrip.id}_${token}`; // tripId + "_" + token
    // short random string
    const expires = Date.now() + 1000 * 60 * 60 * 24; // 24h expiry

    await setDoc(doc(db, "trips", currentTrip.id, "invites", token), {
      createdAt: serverTimestamp(),
      expiresAt: expires,
    });

    const link = `${location.origin}/gosplit/main.html?invite=${inviteParam}`;
    const linkInput = document.getElementById("invite-link");
    linkInput.value = link;
    linkInput.select();
  });

  /* Copy invite link */
document.getElementById("copy-invite").addEventListener("click", ()=>{
  const field = document.getElementById("invite-link");
  field.select();
  document.execCommand("copy");
});

