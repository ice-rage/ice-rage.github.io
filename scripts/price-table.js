(function () {
  "use strict";

  let isTableStructureChanged = false;
  let priceTable = null;

  // Функция, в которой происходит изменение (восстановление) таблицы расценок
  const changeTableStructure = function() {

    // Изменяем структуру таблицы при выполнении двух условий: 
    // 1) ширина вьюпорта менее 450 пикселей
    if (document.body.clientWidth < 450) {
      // 2) структура таблицы еще не была изменена ранее
      if (!isTableStructureChanged) {
        // Получаем содержимое таблицы
        priceTable = document.querySelector("#js-priceTable");

        // Получаем все строки таблицы
        const rows = priceTable.rows;

        for (let i = 0; i < rows.length - 1; i++) {
          if (i % 2 != 0) {
            // Создаем пустую строку таблицы и добавляем ее перед текущей строкой
            const newRow = priceTable.insertRow(i);
  
            // Задаем стилевой класс для строки
            newRow.className = "table__tr";
  
            // Создаем и добавляем пустую ячейку в новую строку 
            newRow.insertCell(0);
  
            // Создаем и добавляем еще одну ячейку в новую строку
            const newCell = newRow.insertCell(1);
  
            // Задаем стилевой класс для ячейки
            newCell.className = "table__td";
  
            // Копируем в нее содержимое из первой ячейки следующей строки
            newCell.innerHTML = rows[i + 1].cells[0].innerHTML;
  
            // Растягиваем ячейку на три столбца таблицы
            newCell.colSpan = 3;
          }
        }
  
        // Полностью удаляем весь первый столбец таблицы
        $("#js-priceTable th:first-child, td:first-child").remove();
  
        isTableStructureChanged = true;
      }
    } else {
      // Если же ширина вьюпорта больше 450 пикселей и при этом структура таблицы
      // была изменена ранее, то нужно восстановить ее отображение
      if (isTableStructureChanged) {
        // Получаем все строки таблицы
        const rows = priceTable.rows;

        for (let i = 0; i < rows.length; i++) {
          // Восстанавливаем первый столбец, добавляя в начало каждой строки по одной ячейке
          const restoredCell = rows[i].insertCell(0);
          
          if (i > 0 && i < rows.length - 1) {
            restoredCell.className = "table__body-th";
          }
          else {
            restoredCell.className = "table__th";
          }

          // Во все четные ячейки восстановленного столбца (кроме первой) копируем содержимое
          // из второй ячейки предыдущей строки
          if (i % 2 == 0 && i > 0) {
            restoredCell.innerHTML = rows[i - 1].cells[1].innerHTML;
          }
        }

        // Удаляем все нечетные строки таблицы, кроме последней
        $("#js-priceTable tr:odd:not(:last)").remove();

        isTableStructureChanged = false;
      } 
    }
  };

  document.addEventListener("DOMContentLoaded", changeTableStructure);
  window.addEventListener("resize", changeTableStructure);
})();
