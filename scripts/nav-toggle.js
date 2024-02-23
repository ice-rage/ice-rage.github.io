(function () {
  "use strict";

  /* Переключение навигации в шапке сайта */

  const root = document.documentElement;

  const navToggle = document.querySelector("#js-navToggle");

  navToggle.addEventListener("click", function () {
    root.classList.toggle("show-nav");
  });
})();