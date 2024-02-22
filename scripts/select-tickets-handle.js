(function () {
  "use strict";

  if (!$) return;

  const reserveForm = $("#js-reserveForm");

  if (reserveForm) {
    
    const reserveCheckboxes = $("#js-reserveChecks :checkbox");
    const sceneTables = $(".js-sceneTable");
    const submitButton = $("#js-reserveSubmit");

    const reserveTickets = $(".js-reserveTickets");

    // Обнуляем кол-во и сумму билетов каждого типа в верстке
    reserveTickets.each(function () {
      $(this).find("[data-price]").text(0);
      $(this).find(".reserve__sum").text(0);
    });

    // Также обнуляем общую сумму билетов
    $("#js-totalSum").text(0);

    // Определяем активный класс для выделения выбранного стола на схеме
    const activeClass = "scene__table--active";
    
    let price = null;

    // Пытаемся прочитать JSON с ценами на билеты, указанный в верстке. Если этого 
    // не удается сделать, выводим сообщение об ошибке в консоль
    try {
      price = jQuery.parseJSON(reserveForm.attr("data-price"));
    } catch(e) {
      console.error(e);
    }

    // Обработчик изменения состояния чекбоксов
    reserveCheckboxes.change(function () {
      
      // Получаем название чекбокса, чье состояние изменилось
      const checkboxName =  $(this).attr("name"); 
        
      sceneTables.filter(function () {

        const sceneTable = $(this);

        // Если на схеме есть стол с соответствующим названием, то переключаем
        // его активный класс
        if (sceneTable.attr("data-check") == checkboxName) {
          sceneTable.toggleClass(activeClass);
        }
      });

      calculateTicketsSum(); // Перерассчитываем сумму билетов

      // Переключаем состояние кнопки "Купить билеты", если требуется
      toggleSubmitButtonState(); 
    });

    // Обработчик нажатия клавишей мыши по столу на схеме
    sceneTables.click(function () {
      
      $(this).toggleClass(activeClass);

      // Получаем название стола, по которому кликнули мышкой
      const sceneTableName = $(this).attr("data-check");

      reserveCheckboxes.filter(function () {

        const checkbox = $(this);

        // Если в списке есть чекбокс с соответствующим названием, то переключаем
        // его состояние
        if (checkbox.attr("name") == sceneTableName) {
          checkbox.prop("checked", !checkbox.prop("checked"));
        }
      });

      calculateTicketsSum(); // Перерассчитываем сумму билетов

      // Переключаем состояние кнопки "Купить билеты", если требуется
      toggleSubmitButtonState();
    });

    // Метод для вычисления суммы выбранных билетов
    const calculateTicketsSum = function () {

      if (price != null) {

        // Массив всех выбранных билетов
        const selectedTickets = [
          {
            // Красные билеты
            count: 0,
            sum: 0
          },
          {
            // Черные билеты
            count: 0,
            sum: 0
          }
        ];
        
        reserveCheckboxes.each(function () {

          // Подсчитываем кол-во черных и красных отмеченных чекбоксов
          if ($(this).is(":checked")) {

            if ($(this).parent("label").hasClass("check--red")) {
              selectedTickets[0].count++;
            } else {
              selectedTickets[1].count++;
            }
          }
        });

        // Вычисляем сумму по каждому типу билетов
        selectedTickets[0].sum = price.red * selectedTickets[0].count;
        selectedTickets[1].sum = price.black * selectedTickets[1].count;

        // Отображаем изменение кол-ва и суммы по каждому типу билетов в верстке
        reserveTickets.each(function (index) {
          $(this).find("[data-price]").text(selectedTickets[index].count);
          $(this).find(".reserve__sum").text(selectedTickets[index].sum);
        });

        // Также обновляем общую сумму покупки
        $("#js-totalSum").text(selectedTickets[0].sum + selectedTickets[1].sum);
      }
    }

    // Метод для переключения состояния кнопки "Купить билеты"
    const toggleSubmitButtonState = function () {
      submitButton.attr("disabled", !reserveCheckboxes.is(":checked"));
    }
  }
})();