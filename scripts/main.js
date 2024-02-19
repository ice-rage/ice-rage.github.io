import mapDarkTheme from "../json/map-dark-theme.json" assert { type: "json" }

(function () {
  "use strict";

  const root = document.documentElement;

  /* Переключение навигации */
  const navToggle = document.querySelector("#js-navToggle");

  navToggle.addEventListener("click", function () {
    root.classList.toggle("show-nav");
  });

  /* Проверка загрузки фонового изображения для листинга событий на главной странице */
  const upcomingWrapper = document.querySelector("#js-upcoming-wrapper");

  const img = new Image();

  const bgImage = getComputedStyle(upcomingWrapper).backgroundImage;

  const url = bgImage.slice(4, -1).replace(/"/g, "");
  img.src = url;

  img.addEventListener("error", function () {
    upcomingWrapper.setAttribute("style", "background-color: white");
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
})();
