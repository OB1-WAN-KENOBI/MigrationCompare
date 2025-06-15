export function updateTable(data, countryKey, prefix) {
  const fields = [
    "cost",
    "climate",
    "safety",
    "healthcare",
    "internet",
    "nomadVisa",
    "banking",
  ];

  if (!data || !data[countryKey]) {
    // Очистить поля, если countryKey пустой или не найден
    fields.forEach((field) => {
      document.getElementById(`${field}-${prefix}`).textContent = "";
    });
    return;
  }

  const values = data[countryKey];

  fields.forEach((field) => {
    document.getElementById(`${field}-${prefix}`).textContent = values[field];
  });
}
