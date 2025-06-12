import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue, set, push, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Firebase config
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

// Tool inventory
const toolInventory = [
  "White truck",
  "Misc. hand tools",
  "Bottle jacks and level",
  "Bottle jacks and level",
  "Bottle jacks and level",
  "Extension cords and Job site lighting",
  "Commercial Electric general purpose fan",
  "DeWalt FlexVolt battery angle grinder",
  "30 ft ladder",
  "30 ft ladder",
  "30 ft ladder",
  "Ryobi 10 in circular saw",
  "Table saw/stand",
  "GP construction tarps",
  "Ryobi electric 14 in chain saw",
  "Porter cable finish nailer",
  "Echo leaf blower",
  "Porter cable brad nailer",
  "Bosch SDS drill",
  "Ryobi trim nailer",
  "Ryobi hammer drill",
  "Porter cable pin nailer",
  "DeWalt corded angle grinder",
  "Porter cable crown nailer",
  "Ryobi 40v 4AH battery with charger",
  "Ryobi 18v 4AH battery"
];

// Populate tool dropdown
const toolSelect = document.getElementById("tool");
toolInventory.forEach(tool => {
  const option = document.createElement("option");
  option.value = tool;
  option.textContent = tool;
  toolSelect.appendChild(option);
});

// Handle form submission
const form = document.getElementById("checkout-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const tool = toolSelect.value;
  const fullName = document.getElementById("fullName").value.trim();
  const checkoutTime = new Date(document.getElementById("checkoutTime").value).getTime();
  const returnTime = new Date(document.getElementById("returnTime").value).getTime();
  const approved = document.getElementById("outsideHours").checked;

  if (!/^\w+\s+\w+$/.test(fullName)) {
    alert("Please enter full name (first and last).");
    return;
  }

  await push(ref(db, "checkouts"), {
    tool,
    checkedOutBy: fullName,
    timestamp: checkoutTime,
    returnTime,
    approved
  });

  form.reset();
});

// Live updates
const tbody = document.getElementById("checkout-body");

onValue(ref(db, "checkouts"), (snapshot) => {
  tbody.innerHTML = "";
  snapshot.forEach((child) => {
    const data = child.val();

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.tool}</td>
      <td>${data.checkedOutBy}</td>
      <td>${new Date(data.timestamp).toLocaleString()}</td>
      <td>${new Date(data.returnTime).toLocaleString()}</td>
      <td>${data.timestamp ? (data.timestamp < 7 || data.timestamp > 17 ? "Yes" : "Manual") : "Manual"}</td>
      <td>${data.approved ? "✅" : "❌"}</td>
    `;
    tbody.appendChild(tr);
  });
});
