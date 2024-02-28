(function () {
  "use strict";

  if (!$ || !$.validator) return;

  $.extend($.validator.messages, {
    required: "Это поле обязательно",
    remote: "Пожалуйста, введите правильное значение.",
    email: "Пожалуйста, введите корректный e-mail",
    url: "Пожалуйста, введите корректный URL.",
    date: "Пожалуйста, введите корректную дату.",
    dateISO: "Пожалуйста, введите корректную дату в формате ISO.",
    number: "Пожалуйста, введите число.",
    digits: "Пожалуйста, введите только цифры.",
    creditcard: "Пожалуйста, введите правильный номер кредитной карты.",
    equalTo: "Пароли не совпадают!",
    extension: "Пожалуйста, выберите файл с правильным расширением.",
    maxlength: $.validator.format(
      "Пожалуйста, введите не больше {0} символов."
    ),
    minlength: $.validator.format(
      "Пожалуйста, введите не меньше {0} символов."
    ),
    rangelength: $.validator.format(
      "Пожалуйста, введите значение длиной от {0} до {1} символов."
    ),
    range: $.validator.format("Пожалуйста, введите число от {0} до {1}."),
    max: $.validator.format(
      "Пожалуйста, введите число, меньшее или равное {0}."
    ),
    min: $.validator.format(
      "Пожалуйста, введите число, большее или равное {0}."
    ),
  });

  $.validator.addMethod(
    "email",
    function (value, element) {
      return (
        this.optional(element) ||
        /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,6}$/.test(value)
      );
    },
    "Введите корректный e-mail"
  );

  const eventForm = $("#js-eventForm");

  if (eventForm.length) {
    eventForm.validate({
      errorElement: "span"
    });
  }

  const subscriptionForm = $("#js-subscriptionForm");

  if (subscriptionForm.length) {

    const subscriptionAction = subscriptionForm.attr("action");
    const subscriptionEmail = subscriptionForm.find("#js-subscriptionEmail");

    subscriptionForm.validate({
      errorElement: "span",
      submitHandler: function (_, event) {
        event.preventDefault();

        $.ajax({
          url: subscriptionAction,
          method: "POST",
          data: {
            email: subscriptionEmail.val()
          },
          success: function () {
            subscriptionEmail.val("");
            subscriptionEmail.trigger("blur");
            toastr.success("Вы успешно подписались на рассылку новостей");
          },
          error: function () {
            toastr.error("Пожалуйста, попробуйте еще раз", "Ошибка");
          }
        });

        // fetch(subscriptionAction, {
        //   method: "POST",
        //   body: {
        //     email: subscriptionEmail.val()
        //   }
        // })
        //   .then(() => {
        //     subscriptionEmail.val("");
        //     subscriptionEmail.trigger("blur");
        //     toastr.success("Вы успешно подписались на рассылку новостей");
        //   })
        //   .catch(() => {
        //     toastr.error("Пожалуйста, попробуйте еще раз", "Ошибка");
        //   });
      }
    });
  }
})();
