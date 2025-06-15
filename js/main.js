import { updateTable } from "./updateTable.js";
import { countryData } from "./data.js";

const select1 = document.getElementById("country1");
const select2 = document.getElementById("country2");

const header1 = document.getElementById("country1-header");
const header2 = document.getElementById("country2-header");

function normalize(str) {
  return str.trim().toLowerCase();
}

function update() {
  const val1 = normalize(select1.options[select1.selectedIndex].text);
  const val2 = normalize(select2.options[select2.selectedIndex].text);

  header1.textContent = val1 || "Страна 1";
  header2.textContent = val2 || "Страна 2";

  updateTable(countryData, val1, "country1");
  updateTable(countryData, val2, "country2");
}

select1.addEventListener("change", update);
select2.addEventListener("change", update);
update();
