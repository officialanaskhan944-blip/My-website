/* ==========================================================================
   Alpine Ascents — search.js
   Global search across the main section content and JSON datasets
   (records, organizations, stories, developments).
   ========================================================================== */

(function (window, $) {
  "use strict";

  var datasets = {
    records: null,
    organizations: null,
    stories: null,
    developments: null
  };

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  // Load all datasets once, storing in a flat searchable structure.
  function preload() {
    var urls = {
      records: "data/records.json",
      organizations: "data/organizations.json",
      stories: "data/stories.json",
      developments: "data/developments.json"
    };
    Object.keys(urls).forEach(function (key) {
      $.ajax({ url: urls[key], dataType: "json", timeout: 10000 })
        .done(function (d) { datasets[key] = d; })
        .fail(function () { datasets[key] = null; });
    });
  }

  function collect() {
    var results = [];

    if (datasets.records) {
      (datasets.records.records || []).forEach(function (r) {
        results.push({
          type: "Record",
          title: r.title,
          text: r.peak + " • " + r.climbers + " (" + r.year + ") — " + r.description,
          anchor: "#records"
        });
      });
    }

    if (datasets.organizations) {
      (datasets.organizations.organizations || []).forEach(function (o) {
        results.push({
          type: "Organization",
          title: o.name,
          text: o.type + " • " + o.city + ", " + o.country + " — " + o.desc,
          anchor: "#organizations"
        });
      });
    }

    if (datasets.stories) {
      (datasets.stories.stories || []).forEach(function (s) {
        results.push({
          type: "Success Story",
          title: s.title,
          text: s.location + " — " + s.achievement,
          anchor: "#stories"
        });
      });
    }

    if (datasets.developments) {
      (datasets.developments.developments || []).forEach(function (d) {
        results.push({
          type: "Development",
          title: d.title,
          text: d.category + " • " + d.author + " — " + d.summary,
          anchor: "#developments"
        });
      });
    }

    return results;
  }

  function search(query) {
    var $box = $("#globalSearchResults");
    query = query.trim().toLowerCase();

    if (!query) {
      $box.html('<p class="text-center text-muted">Type a keyword to search the portal.</p>');
      return;
    }

    var results = collect().filter(function (r) {
      var hay = (r.title + " " + r.text).toLowerCase();
      return hay.indexOf(query) !== -1;
    });

    // Limit to a reasonable number
    results = results.slice(0, 30);

    if (!results.length) {
      $box.html('<div class="alert alert-warning">No results found for "' + escapeHtml(query) + '".</div>');
      return;
    }

    var html =
      '<p class="text-muted mb-3">' + results.length + ' result(s) for "' + escapeHtml(query) + '":</p>';
    results.forEach(function (r) {
      html +=
        '<div class="search-result-item">' +
          '<span class="result-type">' + escapeHtml(r.type) + "</span>" +
          "<h5>" + escapeHtml(r.title) + "</h5>" +
          "<p>" + escapeHtml(r.text) + "</p>" +
          '<a href="' + escapeHtml(r.anchor) + '" class="btn-read">Jump to section <i class="fa-solid fa-arrow-right"></i></a>' +
        "</div>";
    });
    $box.html(html);
  }

  function init() {
    preload();

    function run() {
      search($("#globalSearchInput").val());
    }
    $("#globalSearchBtn").on("click", run);
    $("#globalSearchInput").on("keyup", function (e) {
      if (e.key === "Enter") run();
    });
  }

  $(init);
})(window, jQuery);
