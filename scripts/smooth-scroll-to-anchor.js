(function () {
  "use strict";

  /* При нажатии на ссылку в навигации плавно прокручиваем главную страницу 
     до нужного блока */

  if (!$) return;

  // Получаем корневой элемент страницы (html или body в зависимости от браузера)
  const $root = $("html, body");

  // Скрываем страницу, пока она полностью не загрузится
  $("html").css({ display: "none" });

  $(document).ready(function () {

    // Извлекаем якорь из ссылки
    var anchor = location.hash;

    // Если у ссылки есть якорь, выполняем прокрутку до него
    if (anchor != "" && anchor.length > 1) {

      // Сначала прокручиваем страницу вверх и отображаем
      $(window).scrollTop(0);
      $("html").css({ display: "block" });

      // Затем прокручиваем страницу до якоря
      smoothScrollTo(anchor);
    } else {
      // Иначе просто отображаем страницу
      $("html").css({ display: "block" });
    }

    // Метод, непосредственно выполняющий плавную прокрутку страницы до якоря
    function smoothScrollTo(anchor) {

      // Дополнительные 30 пикселей к общему сдвигу страницы относительно верха
      const additionalPixels = 30;

      // Общий сдвиг страницы при прокрутке складывается из высоты фиксированной шапки
      // и дополнительных пикселей
      const topOffset = $("#js-pageHeader").height() + additionalPixels;

      // Определяем позицию, к которой необходимо пролистать страницу
      var targetPosition = $(anchor).offset().top - topOffset;

      // Прокручиваем корневой элемент
      $root.animate(
        {
          // Устанавливаем вертикальное положение вьюпорта к вычисленной позиции
          scrollTop: targetPosition
        },
        {
          duration: 2000, // Время прокрутки - 2 секунды
          easing: "easeInOutCubic" // Эффект замедления прокрутки
        }
      );

      // Добавляем якорь к URL страницы
      history.pushState(null, null, "/" + anchor);
    }

    $("#js-nav a[href]").on("click", function () {

      // Получаем ссылку из соответствующего атрибута
      const href = $(this).attr("href");

      // Из ссылки извлекаем непосредственно якорь, к которому требуется
      // прокрутить страницу
      const anchor = href.substring(href.indexOf("#"), href.length);

      smoothScrollTo(anchor);

      return false;
    });
  });
})();
