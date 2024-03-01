(function () {
  "use strict";

  const root = document.documentElement;

  /* Открытие/закрытие формы заявки */
  const eventPP = document.querySelector("#js-eventPP");
  const eventOpenBtn = document.querySelector("#js-openEventBtn");

  if (eventPP && eventOpenBtn) {

    const closeEventPP = function (event) {
      function close() {
        document.removeEventListener("keyup", closeEventPP);
        eventPP.removeEventListener("click", closeEventPP);

        root.classList.remove("show-event-popup");
      }

      switch (event.type) {
        case "keyup":
          if (event.key === "Escape" || event.keyCode === 27) close();
          break;
        case "click":
          if (
            event.target === this ||
            event.target.classList.contains("js-ppCloseBtn")
          )
            close();
          break;
      }
    };

    eventOpenBtn.addEventListener("click", function () {
      root.classList.add("show-event-popup");

      document.addEventListener("keyup", closeEventPP);
      eventPP.addEventListener("click", closeEventPP);
    });

    if (!$) return;

    /* Кастомизируем селект для выбора кол-ва посетителей мероприятия */
    const jsSelectric = $(".js-selectric");

    if (jsSelectric.length) {
      jsSelectric.selectric({
        nativeOnMobile: false
      });
    }

    /* Задаем маску полю для ввода номера телефона */
    const mobileMask = $(".js-mobileMask");

    if (mobileMask.length) {
      mobileMask.mask("+7 (000) 000 00 00", {
        placeholder: "+7 (___) ___ __ __",
      });
    }

    /* Инициализируем календарь для выбора даты проведения мероприятия */
    const dateField = $(".js-dateField");

    if (dateField.length) {

      let isVisible = false;

      const initDatepicker = function (currentDatepicker) {
        const dateInput = currentDatepicker.find(".js-dateInput");
        const dateDay = currentDatepicker.find(".js-dateDay");
        const dateMonth = currentDatepicker.find(".js-dateMonth");
        const dateYear = currentDatepicker.find(".js-dateYear");

        const dateConfig = {
          autoClose: true,
          minDate: new Date(),
          navTitles: {
            days: "MMMM <i>yyyy</i>"
          },
          onSelect: function ({ date }) {
            dateDay.val(date ? ("0" + date.getDate()).slice(-2) : "");
            dateMonth.val(date ? ("0" + (date.getMonth() + 1)).slice(-2) : "");
            dateYear.val(date ? date.getFullYear() : "");
            dateInput.valid();
          },
          onShow: function (isFinished) {
            if (isFinished) {
              isVisible = true;
            }
          },
          onHide: function (isFinished) {
            if (isFinished) {
              isVisible = false;
            }
          }
        };

        const airDatepicker = new AirDatepicker(dateInput[0], dateConfig);

        dateInput.on("click", function () {
          if (isVisible) {
            airDatepicker.hide();
          }
        });
      };

      $.each(dateField, function () {
        initDatepicker($(this));
      })
    }
  }
})();