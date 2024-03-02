(function () {
  "use strict";

  if (!$) return;

  // Получаем корневой элемент страницы (html или body в зависимости от браузера)
  const $root = $("html, body");

  $(document).ready(function () {

    // Находим на странице кнопку "вверх-вниз"
    const upDownBtn = $("#js-upDownBtn");

    // Определяем имя модификатора, переводящий кнопку в состояние "вниз"
    const downBtnClass = "up-down-btn--down";

    // Обработчик нажатия на кнопку "вверх-вниз"
    upDownBtn.on("click", function () {

      // Положение, к которому нужно пролистать страницу
      let targetPosition = 0;

      // Если кнопка в состоянии "вниз", то в качестве целевого положения 
      // для прокрутки указываем высоту HTML-документа
      if (upDownBtn.hasClass(downBtnClass)) {
        targetPosition = $(document).height();
      }

      // Выполняем прокрутку корневого элемента к целевому положению
      $root.animate(
        {
          scrollTop: targetPosition
        },
        1000
      );
  
      return false;
    });

    // Обработчик прокрутки окна браузера
    $(window).scroll(function () {

      // Текущее положение прокрутки
      const scrollPosition = $(window).scrollTop();

      // Высота вьюпорта браузера
      const viewportHeight = $(window).height();

      // Высота HTML-документа
      const htmlHeight = $(document).height();

      // Если находимся строго вверху страницы, то добавляем к кнопке модификатор 
      // "вниз"
      if (scrollPosition == 0) {
        upDownBtn.addClass(downBtnClass);
      }
  
      // Если находимся строго внизу страницы, то убираем с кнопки модификатор "вниз",
      // чтобы она перешла в состояние "вверх"
      if (Math.ceil(scrollPosition) + viewportHeight >= htmlHeight) {
        upDownBtn.removeClass(downBtnClass);
      }
    });
  });
})();
