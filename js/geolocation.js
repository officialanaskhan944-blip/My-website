/* ==========================================================================
   Alpine Ascents — geolocation.js
   HTML5 Geolocation API: obtains the user's current position (lat/lng),
   attempts reverse geocoding, updates the ticker, and renders the
   interactive Leaflet map with organization markers.
   ========================================================================== */

(function (window, $) {
  "use strict";

  var currentPos = null;

  function setGeoStatus(type, html) {
    $("#geoStatus").html(
      '<div class="alert alert-' + type + ' py-2">' + html + "</div>"
    );
  }

  function geocodeLabel(lat, lng) {
    // Best-effort reverse geocode using Nominatim (no key required).
    try {
      $.getJSON(
        "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
          lat + "&lon=" + lng,
        function (res) {
          var label = res && res.display_name
            ? res.display_name.split(",").slice(0, 3).join(",")
            : null;
          notifyTicker(label);
          setGeoStatus("success",
            '<i class="fa-solid fa-location-crosshairs"></i> Location detected: ' +
            (label || lat.toFixed(4) + ", " + lng.toFixed(4)));
        }
      ).fail(function () {
        notifyTicker(null);
        setGeoStatus("success",
          '<i class="fa-solid fa-location-crosshairs"></i> Coordinates: ' +
          lat.toFixed(4) + ", " + lng.toFixed(4));
      });
    } catch (e) {
      notifyTicker(null);
      setGeoStatus("success",
        '<i class="fa-solid fa-location-crosshairs"></i> Coordinates: ' +
        lat.toFixed(4) + ", " + lng.toFixed(4));
    }
  }

  function notifyTicker(label) {
    $(window).trigger("alpine:geo", [{
      label: label || null,
      lat: currentPos ? currentPos.lat : null,
      lng: currentPos ? currentPos.lng : null
    }]);
  }

  function locate() {
    if (!navigator.geolocation) {
      setGeoStatus(
        "warning",
        '<i class="fa-solid fa-triangle-exclamation"></i> Geolocation is not supported by this browser.'
      );
      $(window).trigger("alpine:geo", [{ label: "Geolocation unsupported", lat: null, lng: null }]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        currentPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        // Notify ticker immediately with coordinates.
        $(window).trigger("alpine:geo", [{
          label: null,
          lat: currentPos.lat,
          lng: currentPos.lng
        }]);
        geocodeLabel(currentPos.lat, currentPos.lng);
      },
      function (err) {
        var msg = "Unable to retrieve your location.";
        if (err.code === err.PERMISSION_DENIED) msg = "Location permission denied by the user.";
        else if (err.code === err.POSITION_UNAVAILABLE) msg = "Location information is unavailable.";
        else if (err.code === err.TIMEOUT) msg = "The request to get your location timed out.";
        setGeoStatus("warning", '<i class="fa-solid fa-triangle-exclamation"></i> ' + msg);
        $(window).trigger("alpine:geo", [{ label: "Location denied", lat: null, lng: null }]);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  /* ------------------------- Map rendering ------------------------- */

  function initMap(organizations) {
    // Leaflet is loaded globally; if unavailable, show fallback.
    if (typeof L === "undefined") {
      $("#mapFallback").show();
      $("#mapFallback p").text(
        "Interactive map library unavailable — please check your internet connection."
      );
      return;
    }

    var mapEl = document.getElementById("map");
    if (!mapEl) return;

    // Ensure fallback is hidden once we have a real map.
    $("#mapFallback").hide();

    var map = L.map("map", { scrollWheelZoom: false }).setView([30, 60], 3);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Organization markers
    (organizations || []).forEach(function (org) {
      if (typeof org.lat === "number" && typeof org.lng === "number") {
        var popup = "<strong>" + org.name + "</strong><br>" +
          org.city + ", " + org.country +
          (org.website ? '<br><a href="' + org.website + '" target="_blank" rel="noopener">Visit website</a>' : "");
        L.marker([org.lat, org.lng]).addTo(map).bindPopup(popup);
      }
    });

    // User marker if geolocation succeeded.
    if (currentPos) {
      var icon = L.divIcon({
        className: "",
        html: '<div style="background:#e8a34a;width:16px;height:16px;border-radius:50%;border:3px solid #1b3a2f;box-shadow:0 0 8px rgba(0,0,0,.5);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker([currentPos.lat, currentPos.lng], { icon: icon })
        .addTo(map)
        .bindPopup("<strong>You are here</strong>")
        .openPopup();
      map.setView([currentPos.lat, currentPos.lng], 4);
    }

    // Load organization coordinates to fit bounds when no user location.
    if (!currentPos && (organizations || []).length) {
      var pts = organizations
        .filter(function (o) { return typeof o.lat === "number" && typeof o.lng === "number"; })
        .map(function (o) { return [o.lat, o.lng]; });
      if (pts.length) {
        map.fitBounds(L.latLngBounds(pts), { padding: [40, 40] });
      }
    }
  }

  function init() {
    locate();

    // Wait for organizations data, then render the map.
    $.getJSON("data/organizations.json")
      .done(function (d) {
        initMap(d.organizations);
      })
      .fail(function () {
        $("#mapFallback").show();
        $("#mapFallback p").text(
          "Could not load organization coordinates for the map."
        );
      });
  }

  $(init);
})(window, jQuery);
