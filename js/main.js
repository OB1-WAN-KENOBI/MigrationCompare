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

async function update() {
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

  // Загружаем данные из Teleport API для обеих стран
  const [data1, data2] = await Promise.all([
    fetchTeleportData(key1),
    fetchTeleportData(key2),
  ]);

  // Подставляем данные в таблицу
  document.getElementById("cost-country1").textContent = parseTeleportData(
    data1,
    "cost_of_living"
  );
  document.getElementById("cost-country2").textContent = parseTeleportData(
    data2,
    "cost_of_living"
  );
  document.getElementById("rent-country1").textContent = parseTeleportData(
    data1,
    "rent"
  );
  document.getElementById("rent-country2").textContent = parseTeleportData(
    data2,
    "rent"
  );
  document.getElementById("salary-country1").textContent = parseTeleportData(
    data1,
    "salary"
  );
  document.getElementById("salary-country2").textContent = parseTeleportData(
    data2,
    "salary"
  );

  // Остальные поля можно оставить как есть или доработать парсинг

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
