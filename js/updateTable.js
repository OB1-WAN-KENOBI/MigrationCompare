export function updateTable(data, countryKey, prefix) {
  if (!data || !data[countryKey]) return;

  const map = {
    climate: "climate",
    safety: "safety",
    healthcare: "healthcare",
    internet: "internet",
    nomadVisa: "nomadVisa",
    banking: "banking",
    russianCommunity: "russian-community",
    visaRequired: "visa", // 👈 кастомный id
  };

  const values = data[countryKey];

  for (const [field, idPart] of Object.entries(map)) {
    const el = document.getElementById(`${idPart}-${prefix}`);
    if (el) el.textContent = values[field] || "—";
  }
}

function highlightDifferences() {
  const cost1 = parseFloat(document.getElementById("cost-country1").textContent.replace("$", ""));
  const cost2 = parseFloat(document.getElementById("cost-country2").textContent.replace("$", ""));
  if (cost1 && cost2) {
    document.getElementById("cost-country1").style.backgroundColor = cost1 < cost2 ? "#e6ffed" : "#ffe6e6";
    document.getElementById("cost-country2").style.backgroundColor = cost2 < cost1 ? "#e6ffed" : "#ffe6e6";
  }
}