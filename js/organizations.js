/* ==========================================================================
   Alpine Ascents — organizations.js
   Loads and renders organizations & clubs, and populates the map.
   ========================================================================== */

(function (window, $) {
  "use strict";

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function init() {
    $.ajax({ url: "data/organizations.json", dataType: "json", timeout: 10000 })
      .done(function (d) {
        render(d.organizations || []);
      })
      .fail(function () {
        $("#organizationsGrid").html(
          '<div class="col-12"><div class="text-center text-muted py-4">Unable to load organizations data.</div></div>'
        );
      });
  }

  function render(orgs) {
    if (!orgs.length) {
      $("#organizationsGrid").html("<p>No organizations found.</p>");
      return;
    }
    var html = orgs.map(function (o) {
      return (
        '<div class="col-md-6 col-lg-4 fade-in-item">' +
          '<div class="org-card">' +
            '<div class="org-logo"><i class="fa-solid fa-mountain-city"></i></div>' +
            "<h4>" + escapeHtml(o.name) + "</h4>" +
            '<span class="org-type">' + escapeHtml(o.type) + " &bull; Est. " + escapeHtml(o.founded) + "</span>" +
            "<p>" + escapeHtml(o.desc) + "</p>" +
            '<ul class="org-meta">' +
              '<li><i class="fa-solid fa-location-dot"></i> ' + escapeHtml(o.city) + ", " + escapeHtml(o.country) + "</li>" +
              '<li><i class="fa-solid fa-globe"></i> Lat ' + escapeHtml(o.lat) + ", Lng " + escapeHtml(o.lng) + "</li>" +
            "</ul>" +
            (o.website
              ? '<a class="org-link" href="' + escapeHtml(o.website) + '" target="_blank" rel="noopener">Visit Website <i class="fa-solid fa-arrow-up-right-from-square"></i></a>'
              : "") +
          "</div>" +
        "</div>"
      );
    }).join("");
    $("#organizationsGrid").html(html);
  }

  $(init);
})(window, jQuery);
