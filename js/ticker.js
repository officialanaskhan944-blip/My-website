/* ==========================================================================
   Alpine Ascents — ticker.js
   Continuous bottom scrolling ticker showing current date, time and
   (when available) location / latitude / longitude.
   ========================================================================== */

(function (window, $) {
  "use strict";

  var geo = { location: "Location unavailable", lat: "--", lng: "--" };

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function updateDateTime() {
    var now = new Date();
    var dateStr = now.toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    var timeStr =
      pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());

    $("#tickerDate").text(dateStr);
    $("#tickerTime").text(timeStr);
  }

  function updateLocation() {
    $("#tickerLocation").text(geo.location);
    $("#tickerLat").text(geo.lat);
    $("#tickerLng").text(geo.lng);
  }

  /**
   * Receive geolocation data from geolocation.js. The module exposes a
   * global hook via window.AlpineGeo.
   */
  function init() {
    updateDateTime();
    updateLocation();
    setInterval(updateDateTime, 1000);

    // Listen for geolocation updates.
    $(window).on("alpine:geo", function (e, data) {
      if (data) {
        if (data.label) geo.location = data.label;
        if (typeof data.lat === "number") geo.lat = data.lat.toFixed(4);
        if (typeof data.lng === "number") geo.lng = data.lng.toFixed(4);
        updateLocation();
      }
    });
  }

  $(init);
})(window, jQuery);
