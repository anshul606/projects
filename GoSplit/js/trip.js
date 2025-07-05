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
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { nanoid } from "https://cdn.skypack.dev/nanoid"; // tiny id helper

/* Keep the trip object in here */
let currentTrip = null;
let editingId = null;
let deletingId = null;
let latestExpenses = []; // ← holds the live list for export
let latestMembersInfo = []; // ← holds membersInfo for name mapping
let expensesCache = [];

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

/* — new DOM refs — */
const membersList = document.getElementById("members-list");
const memberCountEl = document.getElementById("member-count");

/* Called from main.js when hash loads */
export function openTrip(trip) {
  currentTrip = trip;
  document.getElementById("trip-title").textContent = trip.name;

  latestMembersInfo = trip.membersInfo || [];
  renderMembers(trip.members || [], trip.membersInfo || []); // ← new line

  document.querySelector('.nav-item[data-id="tripview"]')?.click();

  liveExpenseFeed(trip.id, trip.membersInfo || []);
}

/* Live expense listener */
function liveExpenseFeed(tripId, membersInfo) {
  const q = query(
    collection(db, "trips", tripId, "expenses"),
    orderBy("createdAt", "desc")
  );
  onSnapshot(q, (snap) => {
    latestExpenses = snap.docs.map((d) => ({ id: d.id, ...d.data() })); // ✅ set global
    renderExpenses(latestExpenses, membersInfo);
    expensesCache = latestExpenses;
  });
}

/* Render expense list */
function renderExpenses(arr, membersInfo) {
  const uidToName = {};
  membersInfo.forEach((m) => {
    uidToName[m.uid] = m.emailPrefix || (m.uid ?? "").slice(0, 6) + "…";
  });

  const wrap = document.getElementById("expense-list");
  wrap.innerHTML = "";

  if (!arr.length) {
    document.getElementById("no-expense-msg").classList.remove("hidden");
    return;
  }
  document.getElementById("no-expense-msg").classList.add("hidden");

  // header row
  wrap.insertAdjacentHTML(
    "beforeend",
    `
  <div class="expense-row header">
    <div>Description</div>
    <div>Paid&nbsp;by</div>
    <div>Date</div>
    <div class="amount">Amount</div>
    <div></div> <!-- empty cell for actions -->
  </div>
`
  );

  // data rows
  // data rows
  arr.forEach((exp) => {
    const payer = uidToName[exp.payer] || "Anon";
    const date = exp.createdAt
      ? new Date(exp.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

    wrap.insertAdjacentHTML(
      "beforeend",
      `
  <div class="expense-row">
    <div>${exp.description}</div>
    <div>${payer}</div>
    <div>${date}</div>
    <div class="amount">₹${exp.amount}</div>
    <div class="actions">
      <button class="edit-expense" data-id="${exp.id}" title="Edit">
        <i data-lucide="edit-3"></i>
      </button>
      <button class="delete-expense" data-id="${exp.id}" title="Delete">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
  </div>
`
    );

    lucide.createIcons(); // initializes the icons
  });
}

function renderMembers(list, infoList) {
  membersList.innerHTML = "";

  // Build a map uid → label
  const labelMap = {};
  (infoList || []).forEach((o) => (labelMap[o.uid] = o.emailPrefix));

  list.forEach((uid) => {
    const label = labelMap[uid] || uid.slice(0, 6) + "…";
    membersList.insertAdjacentHTML(
      "beforeend",
      `
      <li class="member-badge">
        <img src="assets/profile_images/profile-${Math.floor(
          Math.random() * 10
        )}.jpg">
        ${label}
      </li>
    `
    );
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
document.getElementById("copy-invite").addEventListener("click", () => {
  const field = document.getElementById("invite-link");
  field.select();
  document.execCommand("copy");
});

document.getElementById("expense-list").addEventListener("click", (e) => {
  const row = e.target.closest(".expense-row");
  if (!row) return;
  const expId = row.dataset.id;

  /* DELETE icon */
  if (e.target.closest(".delete-expense")) {
    deletingId = expId;
    openModal("delete-modal");
    return;
  }

  /* EDIT icon */
  if (e.target.closest(".edit-expense")) {
    editingId = expId;
    const oldDesc = row.children[0].textContent.trim();
    const oldAmt = row
      .querySelector(".amount")
      .textContent.replace(/[₹,]/g, "");
    document.getElementById("edit-desc").value = oldDesc;
    document.getElementById("edit-amt").value = oldAmt;
    openModal("edit-modal");
  }
});

/* ---------- DELETE modal buttons ---------- */
document.getElementById("del-confirm").addEventListener("click", async () => {
  if (!deletingId) return;
  await deleteDoc(doc(db, "trips", currentTrip.id, "expenses", deletingId));
  deletingId = null;
  closeModal("delete-modal");
});
document.getElementById("del-cancel").onclick = () =>
  closeModal("delete-modal");

/* ---------- EDIT modal buttons ---------- */
document.getElementById("edit-save").addEventListener("click", async () => {
  if (!editingId) return;
  const newDesc = document.getElementById("edit-desc").value.trim();
  const newAmt = Number(document.getElementById("edit-amt").value);
  if (!newDesc || !newAmt) return;
  await updateDoc(doc(db, "trips", currentTrip.id, "expenses", editingId), {
    description: newDesc,
    amount: newAmt,
  });
  editingId = null;
  closeModal("edit-modal");
});
document.getElementById("edit-cancel").onclick = () => closeModal("edit-modal");

document.getElementById("export-expenses").addEventListener("click", () => {
  // 1. guard clause
  if (!latestExpenses.length) {
    alert("No expenses to export.");
    return;
  }

  // 2. build uid → name map so "Paid By" isn't "Anon"
  const uidToName = {};
  (latestMembersInfo || []).forEach((m) => {
    uidToName[m.uid] =
      m.emailPrefix || // prefer stored prefix
      (m.email || "").split("@")[0] || // fallback to email
      (m.uid ?? "").slice(0, 6) + "…"; // last‑ditch short uid
  });

  // 3. transform rows
  const rows = latestExpenses.map((exp) => ({
    Description: exp.description,
    "Paid By": uidToName[exp.payer] || exp.payerName || "Anon",
    Amount: exp.amount,
    Date: exp.createdAt
      ? new Date(exp.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
  }));

  // 4. create & download XLSX
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Expenses");
  XLSX.writeFile(wb, `${currentTrip?.name || "Trip"}-Expenses.xlsx`);
});
