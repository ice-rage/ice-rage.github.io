import mapDarkTheme from "../json/map-dark-theme.json" assert { type: "json" }

(function () {
  "use strict";

  /* Переключение навигации */
  const root = document.documentElement;

  const navToggle = document.querySelector("#js-navToggle");

  navToggle.addEventListener("click", function () {
    root.classList.toggle("show-nav");
  });

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

    /* Анимация слайдеров */
    const swipers = document.querySelectorAll(".js-swiper");

    swipers.forEach(function (swiper) {
      new Swiper(swiper, {
        updateOnWindowResize: true,
        slidesPerView: "auto",
        freeMode: true,
        spaceBetween: 0,
        speed: 500,
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-arrow-next",
          prevEl: ".swiper-arrow-prev",
          disabledClass: "arrow--disabled",
        },
      });
    });
  }

  /* Проверка загрузки фонового изображения для листинга событий на главной странице */
  const upcomingWrapper = document.querySelector("#js-upcoming-wrapper");

  const img = new Image();

  const bgImage = getComputedStyle(upcomingWrapper).backgroundImage;

  const url = bgImage.slice(4, -1).replace(/"/g, "");
  img.src = url;

  img.addEventListener("error", function () {
    upcomingWrapper.setAttribute("style", "background-color: white");
  });

  /* Инициализация карты */
  initMap();

  async function initMap() {
    // Ожидаем, когда загрузятся все компоненты основного модуля API
    await ymaps3.ready;

    const {
      YMap,
      YMapDefaultSchemeLayer,
      YMapDefaultFeaturesLayer,
      YMapMarker,
    } = ymaps3;

    // Загружаем модуль для работы с маркерами
    //const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');

    // Иницилиазируем карту
    const infoMap = new YMap(
      // Передаём ссылку на HTMLElement контейнера
      document.querySelector("#js-infoMap"),

      // Передаём параметры инициализации карты
      {
        location: {
          // Координаты центра карты
          center: [84.96274, 56.49387],

          // Уровень масштабирования
          zoom: 15,
        },
      }
    );

    if (infoMap) {
      // Добавляем слой для отображения карты (в сером ночном стиле)
      infoMap.addChild(
        new YMapDefaultSchemeLayer({
          theme: "dark",
          customization: mapDarkTheme
        })
      );

      // Добавляем слой для отображения метки поверх карты
      infoMap.addChild(new YMapDefaultFeaturesLayer({}));

      // Создаем метку (маркер + логотип)
      const placemark = document.createElement("div");
      placemark.className = "info-map__placemark";

      // Создаем маркер
      const marker = document.createElement("img");
      marker.className = "info-map__marker";
      marker.src = "assets/images/location.png";

      // Вкладываем маркер внутрь метки
      placemark.appendChild(marker);

      // Создаем логотип как SVG-элемент
      const logoSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );

      logoSvg.setAttribute("width", "78px");
      logoSvg.setAttribute("height", "57px");
      logoSvg.setAttribute("class", "info-map__marker-icon");

      const logoUse = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
      );

      logoUse.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        "assets/icons/symbols.svg#logo"
      );

      logoSvg.appendChild(logoUse);

      // Вкладываем логотип также внутрь метки
      placemark.appendChild(logoSvg);

      // Добавляем метку на карту
      infoMap.addChild(
        new YMapMarker({ coordinates: [84.96274, 56.49385] }, placemark)
      );
    }
  }

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
    const initDatePicker = function (datePicker) {
      const dateInput = datePicker.find(".js-dateInput");
      const dateDay = datePicker.find(".js-dateDay");
      const dateMonth = datePicker.find(".js-dateMonth");
      const dateYear = datePicker.find(".js-dateYear");

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
        }
      };

      new AirDatepicker(dateInput[0], dateConfig);
    };

    $.each(dateField, function () {
      initDatePicker($(this));
    })
  }
})();
