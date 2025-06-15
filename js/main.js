import { updateTable } from "./updateTable.js";
import { countryData } from "./data.js";

const select1 = document.getElementById("country1");
const select2 = document.getElementById("country2");

const header1 = document.getElementById("country1-header");
const header2 = document.getElementById("country2-header");

let numbeoData = {};

// Загрузка данных из numbeo-data.json
fetch("./numbeo-data.json")
  .then((res) => res.json())
  .then((data) => {
    numbeoData = data;
    update(); // обновим таблицу после загрузки
  });

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
    "rent",
    "groceries",
    "transport",
    "salary",
    "climate",
    "safety",
    "healthcare",
    "internet",
    "russian-community",
    "visa",
    "nomadVisa",
    "banking",
  ];
  fields.forEach((field) => {
    document.getElementById(`${field}-country1`).textContent = "";
    document.getElementById(`${field}-country2`).textContent = "";
  });
}

// 🔒 Блокировка одинаковых стран
function syncSelectOptions() {
  const selected1 = select1.value;
  const selected2 = select2.value;

  [...select1.options].forEach((opt) => {
    opt.disabled = opt.value && opt.value === selected2;
  });

  [...select2.options].forEach((opt) => {
    opt.disabled = opt.value && opt.value === selected1;
  });
}

function update() {
  const key1 = normalize(select1.value);
  const key2 = normalize(select2.value);

  const label1 = select1.options[select1.selectedIndex]?.text;
  const label2 = select2.options[select2.selectedIndex]?.text;

  header1.textContent = label1 || "Страна 1";
  header2.textContent = label2 || "Страна 2";

  if (!key1 || !key2) {
    hideSpinner();
    clearTable();
    syncSelectOptions();
    return;
  }

  showSpinner();

  setTimeout(() => {
    const d1 = numbeoData[key1] || {};
    const d2 = numbeoData[key2] || {};

    document.getElementById("cost-country1").textContent = d1.cost_of_living_usd
      ? `$${d1.cost_of_living_usd}`
      : "—";
    document.getElementById("cost-country2").textContent = d2.cost_of_living_usd
      ? `$${d2.cost_of_living_usd}`
      : "—";

    document.getElementById("rent-country1").textContent = d1.rent_usd
      ? `$${d1.rent_usd}`
      : "—";
    document.getElementById("rent-country2").textContent = d2.rent_usd
      ? `$${d2.rent_usd}`
      : "—";

    document.getElementById("groceries-country1").textContent = d1.groceries_usd
      ? `$${d1.groceries_usd}`
      : "—";
    document.getElementById("groceries-country2").textContent = d2.groceries_usd
      ? `$${d2.groceries_usd}`
      : "—";

    document.getElementById("transport-country1").textContent = d1.transport_usd
      ? `$${d1.transport_usd}`
      : "—";
    document.getElementById("transport-country2").textContent = d2.transport_usd
      ? `$${d2.transport_usd}`
      : "—";

    document.getElementById("salary-country1").textContent = d1.salary_usd
      ? `$${d1.salary_usd}`
      : "—";
    document.getElementById("salary-country2").textContent = d2.salary_usd
      ? `$${d2.salary_usd}`
      : "—";

    updateTable(countryData, key1, "country1");
    updateTable(countryData, key2, "country2");

    hideSpinner();
    syncSelectOptions();
  }, 400);
}

select1.addEventListener("change", update);
select2.addEventListener("change", update);
