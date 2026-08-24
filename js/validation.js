/* ==========================================================================
   Alpine Ascents — validation.js
   Contact form validation using jQuery with Bootstrap alert feedback.
   ========================================================================== */

(function (window, $) {
  "use strict";

  function showAlert(type, message) {
    var $alert = $("#formAlert");
    $alert
      .removeClass("d-none alert-success alert-danger alert-warning")
      .addClass("alert-" + type)
      .html(message);
    // Auto-dismiss success after a few seconds.
    if (type === "success") {
      setTimeout(function () {
        $alert.addClass("d-none");
      }, 5000);
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    // Optional: if empty, it's fine; if present, allow digits, spaces, + - ( )
    if (!phone) return true;
    return /^[+\d][\d\s()\-]{5,16}$/.test(phone.trim());
  }

  function validate() {
    var name = $("#cName").val().trim();
    var email = $("#cEmail").val().trim();
    var phone = $("#cPhone").val().trim();
    var subject = $("#cSubject").val();
    var message = $("#cMessage").val().trim();

    var valid = true;

    // Helper to toggle field validity
    function mark($field, ok) {
      if (ok) {
        $field.removeClass("is-invalid").addClass("is-valid");
      } else {
        $field.removeClass("is-valid").addClass("is-invalid");
        valid = false;
      }
    }

    mark($("#cName"), name.length >= 2);
    mark($("#cEmail"), validateEmail(email));
    mark($("#cPhone"), validatePhone(phone));
    mark($("#cSubject"), subject !== "");
    mark($("#cMessage"), message.length >= 10);

    return valid;
  }

  function init() {
    // Live validation feedback on blur.
    $("#contactForm input, #contactForm select, #contactForm textarea").on("blur", function () {
      var id = this.id;
      if (id === "cName") {
        var ok = this.value.trim().length >= 2;
        $(this).toggleClass("is-invalid", !ok).toggleClass("is-valid", ok);
      }
    });

    $("#contactForm").on("submit", function (e) {
      e.preventDefault();

      if (!validate()) {
        showAlert(
          "danger",
          '<i class="fa-solid fa-circle-exclamation"></i> Please correct the highlighted fields and try again.'
        );
        return;
      }

      // Simulate a successful submission (no backend).
      showAlert(
        "success",
        '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been submitted successfully. We\'ll get back to you shortly.'
      );

      // Reset the form and field states.
      this.reset();
      $(this).find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
    });
  }

  $(init);
})(window, jQuery);
