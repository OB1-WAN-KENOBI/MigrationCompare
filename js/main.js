import { updateTable } from "./updateTable.js";
import { countryData } from "./data.js";

const select1 = document.getElementById("country1");
const select2 = document.getElementById("country2");

const header1 = document.getElementById("country1-header");
const header2 = document.getElementById("country2-header");

let numbeoData = {};

fetch("./numbeo-data.json")
  .then((res) => res.json())
  .then((data) => {
    numbeoData = data;
    update();
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

function highlightBetter(field, v1, v2, lowerIsBetter = true) {
  const c1 = document.getElementById(`${field}-country1`);
  const c2 = document.getElementById(`${field}-country2`);
  c1.classList.remove("highlight-better");
  c2.classList.remove("highlight-better");

  const n1 = parseFloat(v1);
  const n2 = parseFloat(v2);
  if (isNaN(n1) || isNaN(n2)) return;

  const better = lowerIsBetter ? (n1 < n2 ? c1 : c2) : n1 > n2 ? c1 : c2;
  better.classList.add("highlight-better");
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

    const cost1 = d1.cost_of_living_usd || 0;
    const cost2 = d2.cost_of_living_usd || 0;
    document.getElementById("cost-country1").textContent = cost1
      ? `$${cost1}`
      : "—";
    document.getElementById("cost-country2").textContent = cost2
      ? `$${cost2}`
      : "—";
    highlightBetter("cost", cost1, cost2, true);

    const rent1 = d1.rent_usd || 0;
    const rent2 = d2.rent_usd || 0;
    document.getElementById("rent-country1").textContent = rent1
      ? `$${rent1}`
      : "—";
    document.getElementById("rent-country2").textContent = rent2
      ? `$${rent2}`
      : "—";
    highlightBetter("rent", rent1, rent2, true);

    const food1 = d1.groceries_usd || 0;
    const food2 = d2.groceries_usd || 0;
    document.getElementById("groceries-country1").textContent = food1
      ? `$${food1}`
      : "—";
    document.getElementById("groceries-country2").textContent = food2
      ? `$${food2}`
      : "—";
    highlightBetter("groceries", food1, food2, true);

    const transport1 = d1.transport_usd || 0;
    const transport2 = d2.transport_usd || 0;
    document.getElementById("transport-country1").textContent = transport1
      ? `$${transport1}`
      : "—";
    document.getElementById("transport-country2").textContent = transport2
      ? `$${transport2}`
      : "—";
    highlightBetter("transport", transport1, transport2, true);

    const salary1 = d1.salary_usd || 0;
    const salary2 = d2.salary_usd || 0;
    document.getElementById("salary-country1").textContent = salary1
      ? `$${salary1}`
      : "—";
    document.getElementById("salary-country2").textContent = salary2
      ? `$${salary2}`
      : "—";
    highlightBetter("salary", salary1, salary2, false);

    updateTable(countryData, key1, "country1");
    updateTable(countryData, key2, "country2");

    hideSpinner();
    syncSelectOptions();
    const offset = -350;
    const block = document.querySelector(".comparison-section");
    const top = block.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }, 400);
}

select1.addEventListener("change", update);
select2.addEventListener("change", update);
