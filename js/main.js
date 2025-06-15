import { updateTable } from "./updateTable.js";
import { countryData } from "./data.js";

const select1 = document.getElementById("country1");
const select2 = document.getElementById("country2");

const header1 = document.getElementById("country1-header");
const header2 = document.getElementById("country2-header");

function normalize(str) {
  return str.trim().toLowerCase();
}

function showSpinner() {
  document.getElementById("table-spinner").style.display = "block";
  document.querySelector(".comparison-table").style.opacity = "0.3";
}

function hideSpinner() {
  document.getElementById("table-spinner").style.display = "none";
  document.querySelector(".comparison-table").style.opacity = "1";
}

function clearTable() {
  const fields = [
    "cost",
    "climate",
    "safety",
    "healthcare",
    "internet",
    "nomadVisa",
    "banking",
  ];
  fields.forEach((field) => {
    document.getElementById(`${field}-country1`).textContent = "";
    document.getElementById(`${field}-country2`).textContent = "";
  });
}

function update() {
  const key1 = normalize(select1.value); // ключи → на английском: 'armenia'
  const key2 = normalize(select2.value);

  const label1 = select1.options[select1.selectedIndex]?.text;
  const label2 = select2.options[select2.selectedIndex]?.text;

  header1.textContent = label1 || "Страна 1";
  header2.textContent = label2 || "Страна 2";

  if (!key1 || !key2) {
    hideSpinner();
    clearTable();
    return;
  }

  showSpinner();

  setTimeout(() => {
    updateTable(countryData, key1, "country1");
    updateTable(countryData, key2, "country2");
    hideSpinner();
  }, 400);
}

select1.addEventListener("change", update);
select2.addEventListener("change", update);
update();
