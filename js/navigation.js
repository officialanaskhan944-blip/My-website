/* ==========================================================================
   Alpine Ascents — navigation.js
   Active navbar highlighting, smooth scrolling, navbar scroll effect,
   back-to-top button and mobile menu auto-close.
   ========================================================================== */

(function (window, $) {
  "use strict";

  function init() {
    var $nav = $("#mainNavbar");
    var $links = $(".nav-link");
    var $sections = $("section[id], header[id]");
    var $backToTop = $("#back-to-top");

    /* -------- Navbar background on scroll -------- */
    function onScroll() {
      var scrollTop = $(window).scrollTop();

      // Navbar scrolled state
      if (scrollTop > 60) $nav.addClass("scrolled");
      else $nav.removeClass("scrolled");

      // Back-to-top visibility
      if (scrollTop > 500) $backToTop.addClass("show");
      else $backToTop.removeClass("show");

      // Active link highlighting (scroll-spy)
      var currentId = "";
      $sections.each(function () {
        var top = $(this).offset().top - ($nav.outerHeight() + 100);
        if (scrollTop >= top) currentId = $(this).attr("id");
      });

      $links.removeClass("active");
      $links.each(function () {
        if ($(this).attr("href") === "#" + currentId) {
          $(this).addClass("active");
        }
      });
    }

    $(window).on("scroll resize", function () {
      requestAnimationFrame(onScroll);
    });
    onScroll();

    /* -------- Smooth scrolling for anchor links -------- */
    $(document).on("click", 'a[href^="#"]', function (e) {
      var target = $(this).attr("href");
      if (target === "#" || target.length === 1) return;
      var $target = $(target);
      if (!$target.length) return;

      e.preventDefault();
      var offset = $nav.outerHeight() + 10;
      $("html, body").animate(
        { scrollTop: $target.offset().top - offset },
        700,
        "swing"
      );

      // Update active link immediately on click
      $links.removeClass("active");
      $(this).addClass("active");

      // Close mobile menu after navigation
      var $collapse = $("#navMenu");
      if ($collapse.hasClass("show")) {
        var modal = bootstrap.Collapse.getInstance($collapse[0]);
        if (modal) modal.hide();
      }
    });

    /* -------- Back-to-top click -------- */
    $backToTop.on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 600, "swing");
    });

    /* -------- Close mobile menu on outside click (optional) -------- */
    $(document).on("click", function (e) {
      var $collapse = $("#navMenu");
      if (
        $collapse.hasClass("show") &&
        !$(e.target).closest(".navbar").length
      ) {
        var modal = bootstrap.Collapse.getInstance($collapse[0]);
        if (modal) modal.hide();
      }
    });
  }

  $(init);
})(window, jQuery);
