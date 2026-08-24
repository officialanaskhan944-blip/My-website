/* ==========================================================================
   Alpine Ascents — developments.js
   Loads, renders and filters the latest developments / articles.
   ========================================================================== */

(function (window, $) {
  "use strict";

  var articles = [];
  var categories = [];

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch (e) {
      return iso;
    }
  }

  function render(list) {
    var $grid = $("#developmentsGrid");
    if (!list.length) {
      $grid.html('<div class="col-12"><div class="text-center text-muted py-4">No articles match your search.</div></div>');
      return;
    }
    var html = list.map(function (a, i) {
      return (
        '<div class="col-md-6 col-lg-4 fade-in-item">' +
          '<div class="dev-card">' +
            '<div class="dev-img">' +
              '<img src="' + escapeHtml(a.image) + '" alt="' + escapeHtml(a.alt || a.title) + '" loading="lazy" ' +
                'onerror="this.onerror=null;this.src=\'https://picsum.photos/seed/dev' + a.id + '/600/360\';">' +
              '<span class="dev-category">' + escapeHtml(a.category) + "</span>" +
            "</div>" +
            '<div class="dev-body">' +
              "<h4>" + escapeHtml(a.title) + "</h4>" +
              '<p class="dev-summary">' + escapeHtml(a.summary) + "</p>" +
              '<div class="dev-meta">' +
                '<span><i class="fa-solid fa-user-pen"></i>' + escapeHtml(a.author) + "</span>" +
                '<span><i class="fa-regular fa-calendar"></i>' + formatDate(a.date) + "</span>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    $grid.html(html);
  }

  function populateFilter() {
    var $sel = $("#developmentsFilter");
    var html = '<option value="">All Categories</option>';
    categories.forEach(function (c) {
      html += '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + "</option>";
    });
    $sel.html(html);
  }

  function applyFilters() {
    var q = $("#developmentsSearch").val().trim().toLowerCase();
    var cat = $("#developmentsFilter").val();
    var filtered = articles.filter(function (a) {
      var matchesCat = !cat || a.category === cat;
      var hay = (a.title + " " + a.summary + " " + a.author + " " + a.category).toLowerCase();
      var matchesQ = !q || hay.indexOf(q) !== -1;
      return matchesCat && matchesQ;
    });
    render(filtered);
  }

  function init() {
    $.ajax({ url: "data/developments.json", dataType: "json", timeout: 10000 })
      .done(function (d) {
        articles = d.developments || [];
        categories = [];
        articles.forEach(function (a) {
          if (a.category && categories.indexOf(a.category) === -1) categories.push(a.category);
        });
        categories.sort();
        populateFilter();
        render(articles);
      })
      .fail(function () {
        $("#developmentsGrid").html(
          '<div class="col-12"><div class="text-center text-muted py-4">Unable to load developments data.</div></div>'
        );
      });

    var debounce;
    $("#developmentsSearch").on("input", function () {
      clearTimeout(debounce);
      debounce = setTimeout(applyFilters, 250);
    });
    $("#developmentsFilter").on("change", applyFilters);
  }

  $(init);
})(window, jQuery);
