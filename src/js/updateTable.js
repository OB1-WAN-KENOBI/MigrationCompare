import "../css/layout.css";

// Функция обновляет значения в таблице для выбранной страны
export function updateTable(data, countryKey, prefix) {
  // Если нет данных или выбранного ключа, выходим
  if (!data || !data[countryKey]) return;

  // Словарь: ключи объекта данных ↔ части id элементов в DOM
  const map = {
    climate: "climate", // Климатические показатели
    safety: "safety", // Уровень безопасности
    healthcare: "healthcare", // Качество здравоохранения
    internet: "internet", // Доступность интернета
    nomadVisa: "nomadVisa", // Варианты номадической визы
    banking: "banking", // Банковские услуги
    russianCommunity: "russian-community", // Размер русскоязычной общины
    visaRequired: "visa", // Необходимость визы (кастомный id)
  };

  // Значения для текущей страны
  const values = data[countryKey];

  // Обновляем текстовый контент каждого элемента по id
  for (const [field, idPart] of Object.entries(map)) {
    const elementId = `${idPart}-${prefix}`; // Например, 'climate-country1'
    const el = document.getElementById(elementId);
    if (el) {
      // Если значение отсутствует, показываем прочерк
      el.textContent = values[field] ?? "—";
    }
  }
}

// Функция подсвечивает ячейки с наименьшей стоимостью жизни
function highlightDifferences() {
  // Получаем элементы таблицы по id
  const el1 = document.getElementById("cost-country1");
  const el2 = document.getElementById("cost-country2");
  if (!el1 || !el2) return;

  // Извлекаем числовые значения из текста, убирая все символы, кроме цифр и точки
  const cost1 = parseFloat(el1.textContent.replace(/[^0-9.]/g, ""));
  const cost2 = parseFloat(el2.textContent.replace(/[^0-9.]/g, ""));
  // Проверяем, что оба значения корректны
  if (isNaN(cost1) || isNaN(cost2)) return;

  // Подсвечиваем: зелёным – меньшая стоимость, красным – большая
  el1.style.backgroundColor = cost1 < cost2 ? "#e6ffed" : "#ffe6e6";
  el2.style.backgroundColor = cost2 < cost1 ? "#e6ffed" : "#ffe6e6";
}
