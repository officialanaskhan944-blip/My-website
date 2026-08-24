/* ==========================================================================
   Alpine Ascents — visitor-counter.js
   Persistent visitor counter using localStorage.
   ========================================================================== */

(function (window, $) {
  "use strict";

  var STORAGE_KEY = "alpineAscentsVisitorCount";

  function init() {
    var $count = $("#visitorCount");
    if (!$count.length) return;

    var current = 0;
    try {
      current = parseInt(localStorage.getItem(STORAGE_KEY), 10) || 0;
    } catch (e) {
      current = 0;
    }

    // Base seed so the counter looks populated on first visit.
    if (current === 0) current = 1047;
    current += 1;

    try {
      localStorage.setItem(STORAGE_KEY, String(current));
    } catch (e) {
      /* storage unavailable — counter still displays */
    }

    // Format with thousands separators.
    $count.text(current.toLocaleString());
  }

  $(init);
})(window, jQuery);
