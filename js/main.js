import { updateTable } from "./updateTable.js";
import { countryData } from "./data.js";

const select1 = document.getElementById("country1");
const select2 = document.getElementById("country2");
const table = document.querySelector(".comparison-table");

const header1 = document.getElementById("country1-header");
const header2 = document.getElementById("country2-header");

let numbeoData = {};

const citySlugs = {
  armenia: "yerevan",
  serbia: "belgrade",
  philippines: "manila",
  vietnam: "hanoi",
  albania: "tirana",
  georgia: "tbilisi",
  mexico: "mexico-city",
  portugal: "lisbon",
  thailand: "bangkok",
  turkiye: "istanbul",
};

const iataCodes = {
  armenia: "EVN",
  serbia: "BEG",
  philippines: "MNL",
  vietnam: "HAN",
  albania: "TIA",
  georgia: "TBS",
  mexico: "MEX",
  portugal: "LIS",
  thailand: "BKK",
  turkiye: "IST",
};

async function fetchTeleportData(countryKey) {
  const slug = citySlugs[countryKey];
  if (!slug) return null;
  const res = await fetch(
    `https://api.teleport.org/api/urban_areas/slug:${slug}/details/`
  );
  if (!res.ok) return null;
  return await res.json();
}

function parseTeleportData(data, field) {
  if (!data) return "—";
  // Примеры парсинга (можно расширять):
  if (field === "cost_of_living") {
    const cat = data.categories.find((cat) => cat.id === "COST-OF-LIVING");
    if (!cat) return "—";
    const item = cat.data.find((d) => d.id === "COST-OF-LIVING-INDEX");
    return item ? item.float_value : "—";
  }
  if (field === "rent") {
    const cat = data.categories.find((cat) => cat.id === "HOUSING");
    if (!cat) return "—";
    const item = cat.data.find((d) => d.id === "APARTMENT-RENT-OUTSIDE-CENTRE");
    return item ? item.currency_dollar_value : "—";
  }
  if (field === "salary") {
    const cat = data.categories.find((cat) => cat.id === "SALARIES");
    if (!cat) return "—";
    const item = cat.data.find(
      (d) => d.id === "AVERAGE-MONTHLY-NET-SALARY-AFTER-TAX"
    );
    return item ? item.currency_dollar_value : "—";
  }
  // Можно добавить парсинг других полей
  return "—";
}

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

function getCountryKeyByLabel(label) {
  if (!label) return null;
  const lower = label.toLowerCase();
  return Object.keys(iataCodes).find((key) => lower.includes(key));
}

function getDateInTwoWeeks() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date;
}

function formatAviasalesDate(dateObj) {
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  return day + month;
}

function updateAviaButtons(key1, key2) {
  const avia = document.getElementById("avia-buttons");
  if (!iataCodes[key1] || !iataCodes[key2]) {
    avia.innerHTML = "";
    return;
  }
  const dateObj = getDateInTwoWeeks();
  const dateStr = formatAviasalesDate(dateObj);
  const planeIcon = `<span class='plane' aria-hidden='true'><svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M2 19L20 11L2 3V9L17 11L2 13V19Z' fill='white'/></svg></span>`;
  avia.innerHTML = `
    <a href="https://www.aviasales.ru/search/MOW${dateStr}${
    iataCodes[key1]
  }" target="_blank" class="aviasales-btn">${planeIcon}Авиабилеты в ${
    select1.options[select1.selectedIndex].text
  }</a>
    <a href="https://www.aviasales.ru/search/MOW${dateStr}${
    iataCodes[key2]
  }" target="_blank" class="aviasales-btn">${planeIcon}Авиабилеты в ${
    select2.options[select2.selectedIndex].text
  }</a>
  `;
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

    updateAviaButtons(key1, key2);
  }, 400);
}

if (select1 && select2 && table) {
  select1.addEventListener("change", update);
  select2.addEventListener("change", update);
}

function initMobileMenu() {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector(".nav");
  const body = document.body;
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", function () {
    nav.classList.toggle("active");
    body.classList.toggle("menu-open");
    // Анимация бургер-меню
    const spans = this.querySelectorAll("span");
    spans[0].classList.toggle("rotate-45");
    spans[1].classList.toggle("opacity-0");
    spans[2].classList.toggle("rotate-negative-45");
  });

  document.addEventListener("click", function (e) {
    if (
      !nav.contains(e.target) &&
      !menuToggle.contains(e.target) &&
      nav.classList.contains("active")
    ) {
      nav.classList.remove("active");
      body.classList.remove("menu-open");
      const spans = menuToggle.querySelectorAll("span");
      spans[0].classList.remove("rotate-45");
      spans[1].classList.remove("opacity-0");
      spans[2].classList.remove("rotate-negative-45");
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && nav.classList.contains("active")) {
      nav.classList.remove("active");
      body.classList.remove("menu-open");
      const spans = menuToggle.querySelectorAll("span");
      spans[0].classList.remove("rotate-45");
      spans[1].classList.remove("opacity-0");
      spans[2].classList.remove("rotate-negative-45");
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileMenu);
} else {
  initMobileMenu();
}
