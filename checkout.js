import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

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

const toolInventory = [
  "White truck",
  "Misc. hand tools",
  "Bottle jacks and level 1",
  "Bottle jacks and level 2",
  "Bottle jacks and level 3",
  "Extension cords and Job site lighting",
  "Commercial Electric general purpose fan",
  "DeWalt FlexVolt battery angle grinder",
  "30 ft ladder 1",
  "30 ft ladder 2",
  "30 ft ladder 3",
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

const toolButtonsContainer = document.getElementById("tool-buttons-container");
const form = document.getElementById("checkout-form");
const fullNameInput = document.getElementById("fullName");
const checkoutTimeInput = document.getElementById("checkoutTime");
const returnTimeInput = document.getElementById("returnTime");

let activeTool = null;

// Render tool buttons
function renderToolButtons(checkouts) {
  toolButtonsContainer.innerHTML = "";
  const checkedOutMap = {};

  Object.entries(checkouts).forEach(([id, data]) => {
    checkedOutMap[data.tool] = { ...data, id };
  });

  toolInventory.forEach(tool => {
    const isCheckedOut = checkedOutMap[tool];
    const button = document.createElement("button");
    button.textContent = tool;
    button.disabled = !!isCheckedOut;
    button.className = isCheckedOut ? "tool-button disabled" : "tool-button";

    const wrapper = document.createElement("div");
    wrapper.className = "tool-container";

    if (!isCheckedOut) {
      button.addEventListener("click", () => {
        activeTool = tool;
        form.style.display = "block";
      });
      wrapper.appendChild(button);
    } else {
      wrapper.appendChild(button);

      const info = document.createElement("div");
      info.className = "tool-info";
      info.innerHTML = `
        <strong>Checked out by:</strong> ${isCheckedOut.checkedOutBy}<br>
        <strong>Time out:</strong> ${new Date(isCheckedOut.timestamp).toLocaleString()}<br>
        <strong>Return by:</strong> ${new Date(isCheckedOut.returnTime).toLocaleString()}
      `;

      const checkInBtn = document.createElement("button");
      checkInBtn.textContent = "Check In";
      checkInBtn.className = "checkin-button";
      checkInBtn.addEventListener("click", () => {
        remove(ref(db, `checkouts/${isCheckedOut.id}`));
      });

      wrapper.appendChild(info);
      wrapper.appendChild(checkInBtn);
    }

    toolButtonsContainer.appendChild(wrapper);
  });
}

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = fullNameInput.value.trim();
  const checkoutTime = new Date(checkoutTimeInput.value).getTime();
  const returnTime = new Date(returnTimeInput.value).getTime();

  if (!/^\w+\s+\w+$/.test(fullName)) {
    alert("Please enter full name (first and last).");
    return;
  }

  await push(ref(db, "checkouts"), {
    tool: activeTool,
    checkedOutBy: fullName,
    timestamp: checkoutTime,
    returnTime
  });

  form.reset();
  form.style.display = "none";
  activeTool = null;
});

// Live data update
onValue(ref(db, "checkouts"), (snapshot) => {
  const data = {};
  snapshot.forEach(child => {
    data[child.key] = child.val();
  });
  renderToolButtons(data);
});
