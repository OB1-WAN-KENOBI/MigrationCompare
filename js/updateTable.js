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
