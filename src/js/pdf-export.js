import "../css/layout.css";

document.addEventListener("DOMContentLoaded", () => {
  const exportBtn = document.getElementById("export-pdf");

  if (!exportBtn) return;

  exportBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const map = {
      armenia: "Armenia",
      serbia: "Serbia",
      philippines: "Philippines",
      vietnam: "Vietnam",
      albania: "Albania",
      georgia: "Georgia",
      mexico: "Mexico",
      portugal: "Portugal",
      thailand: "Thailand",
      turkiye: "Turkey",
    };

    const country1 =
      map[document.getElementById("country1")?.value] || "Country 1";
    const country2 =
      map[document.getElementById("country2")?.value] || "Country 2";

    doc.setFontSize(16);
    doc.text("Country Comparison", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 14, 28);

    const rows = [];
    const table = document.querySelector(".comparison-table tbody");
    if (!table) return;

    table.querySelectorAll("tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 3) {
        const label = cells[0].textContent.trim();
        const val1 = cells[1].textContent.trim();
        const val2 = cells[2].textContent.trim();
        rows.push([translate(label), translate(val1), translate(val2)]);
      }
    });

    doc.autoTable({
      startY: 36,
      head: [["Criteria", country1, country2]],
      body: rows,
      styles: { halign: "center" },
      headStyles: { fillColor: [30, 136, 229], textColor: 255 },
      margin: { left: 14, right: 14 },
    });

    doc.save("comparison.pdf");
  });
});

// Перевод заголовков и значений
function translate(text) {
  const map = {
    // Критерии
    "Стоимость жизни (в месяц)": "Cost of living (monthly)",
    "Аренда жилья": "Rent",
    Продукты: "Groceries",
    Транспорт: "Transport",
    "Средняя зарплата": "Average salary",
    Климат: "Climate",
    Безопасность: "Safety",
    Медицина: "Healthcare",
    "Интернет (скорость)": "Internet",
    "Русскоязычное сообщество": "Russian-speaking community",
    "Нужна ли виза": "Visa required",
    "Digital Nomad виза": "Digital Nomad visa",
    "Банковская система": "Banking",

    // Значения
    Континентальный: "Continental",
    Тропический: "Tropical",
    "Умеренно-континентальный": "Moderate continental",
    Средняя: "Average",
    Хорошая: "Good",
    Низкая: "Low",
    Базовая: "Basic",
    Отличный: "Excellent",
    Хороший: "Good",
    Есть: "Yes",
    Нет: "No",
    "Пока нет": "Not yet",
    Развитая: "Advanced",
    Средний: "Moderate",
    Развивающаяся: "Developing",
  };

  return map[text.trim()] || text;
}
