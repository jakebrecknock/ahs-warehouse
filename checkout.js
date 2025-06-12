import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAA8OvcpaAcj2u_XajFEiGARBuR-xlTS-o",
  authDomain: "warehouse-checkout.firebaseapp.com",
  databaseURL: "https://warehouse-checkout-default-rtdb.firebaseio.com",
  projectId: "warehouse-checkout",
  storageBucket: "warehouse-checkout.firebasestorage.app",
  messagingSenderId: "787545131900",
  appId: "1:787545131900:web:82e819ce152bc6801572f9",
  measurementId: "G-TC7QLTB522"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Helper to check work hours (e.g. 7AM - 5PM)
function isOutsideWorkHours(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  return hours < 7 || hours > 17;
}

// Render table
const tbody = document.getElementById("checkout-body");

onValue(ref(db, "checkouts"), (snapshot) => {
  tbody.innerHTML = "";
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    const key = childSnapshot.key;
    const outside = isOutsideWorkHours(data.timestamp);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.tool}</td>
      <td>${data.checkedOutBy}</td>
      <td>${new Date(data.timestamp).toLocaleString()}</td>
      <td>${outside ? "Yes" : "No"}</td>
      <td>${data.approved ? "✅" : "❌"}</td>
      <td>
        ${!data.approved && outside ? `<button data-key="${key}">Approve</button>` : ""}
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Attach approve listeners
  document.querySelectorAll("button[data-key]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-key");
      update(ref(db, "checkouts/" + key), {
        approved: true
      });
    });
  });
});
