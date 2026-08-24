/* ==========================================================================
   Alpine Ascents — records.js
   Loads, renders and filters mountaineering records.
   ========================================================================== */

(function (window, $) {
  "use strict";

  var allRecords = [];
  var categories = [];

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function render(records) {
    var $grid = $("#recordsGrid");
    if (!records.length) {
      $grid.html('<div class="col-12"><div class="text-center text-muted py-4">No records match your search.</div></div>');
      $("#recordsCount").text("0 records found");
      return;
    }
    var html = records.map(function (r) {
      return (
        '<div class="col-md-6 col-lg-4 fade-in-item">' +
          '<div class="record-card">' +
            '<span class="record-category">' + escapeHtml(r.category) + "</span>" +
            '<div style="display:flex;align-items:baseline;justify-content:space-between;">' +
              '<h4>' + escapeHtml(r.title) + "</h4>" +
            "</div>" +
            '<div class="record-year">' + escapeHtml(r.year) + "</div>" +
            '<ul class="record-meta">' +
              '<li><i class="fa-solid fa-mountain"></i> ' + escapeHtml(r.peak) + ' (' + escapeHtml(r.height) + ')</li>' +
              '<li><i class="fa-solid fa-user-group"></i> ' + escapeHtml(r.climbers) + "</li>" +
              '<li><i class="fa-solid fa-location-dot"></i> ' + escapeHtml(r.country) + "</li>" +
            "</ul>" +
            "<p style='margin-top:10px;font-size:.9rem;color:#5c6b64;'>" + escapeHtml(r.description) + "</p>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    $grid.html(html);
    $("#recordsCount").text(records.length + " record" + (records.length === 1 ? "" : "s") + " found");
  }

  function populateFilter() {
    var $sel = $("#recordsFilter");
    var html = '<option value="">All Categories</option>';
    categories.forEach(function (c) {
      html += '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + "</option>";
    });
    $sel.html(html);
  }

  function applyFilters() {
    var q = $("#recordsSearch").val().trim().toLowerCase();
    var cat = $("#recordsFilter").val();
    var filtered = allRecords.filter(function (r) {
      var matchesCat = !cat || r.category === cat;
      var hay = (r.title + " " + r.peak + " " + r.climbers + " " + r.country + " " + r.description).toLowerCase();
      var matchesQ = !q || hay.indexOf(q) !== -1;
      return matchesCat && matchesQ;
    });
    render(filtered);
  }

  function init() {
    $.ajax({ url: "data/records.json", dataType: "json", timeout: 10000 })
      .done(function (d) {
        allRecords = d.records || [];
        categories = [];
        allRecords.forEach(function (r) {
          if (r.category && categories.indexOf(r.category) === -1) categories.push(r.category);
        });
        categories.sort();
        populateFilter();
        render(allRecords);
      })
      .fail(function () {
        $("#recordsGrid").html(
          '<div class="col-12"><div class="text-center text-muted py-4">Unable to load records data. Please refresh the page.</div></div>'
        );
      });

    // Debounced search
    var debounce;
    $("#recordsSearch").on("input", function () {
      clearTimeout(debounce);
      debounce = setTimeout(applyFilters, 250);
    });
    $("#recordsFilter").on("change", applyFilters);
  }

  $(init);
})(window, jQuery);
