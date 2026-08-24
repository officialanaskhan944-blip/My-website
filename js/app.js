/* ==========================================================================
   Alpine Ascents — app.js
   Core initialisation, shared data loading, reveal-on-scroll, stats,
   generic section renderers (styles, techniques, sheltering, equipment,
   hazards, guidelines) and global UI behaviours.
   ========================================================================== */

(function (window, $) {
  "use strict";

  // Shared namespace for caching loaded JSON across modules.
  window.AlpineData = window.AlpineData || {};

  /**
   * Load a JSON file via jQuery AJAX with error handling.
   * @param {string}  url     JSON file path.
   * @param {function} done   Success callback(data).
   * @param {function} fail   Optional failure callback.
   */
  function loadJSON(url, done, fail) {
    $.ajax({
      url: url,
      dataType: "json",
      timeout: 10000
    })
      .done(function (data) {
        window.AlpineData[url] = data;
        if (typeof done === "function") done(data);
      })
      .fail(function (xhr, status, err) {
        console.warn("Failed to load " + url + ":", status, err);
        if (typeof fail === "function") fail(status, err);
      });
  }

  /* ----------------------- Render helpers ----------------------- */

  function renderStyles() {
    loadJSON(
      "data/mountaineering.json",
      function (d) {
        var $grid = $("#stylesGrid");
        var html = (d.styles || []).map(function (s) {
          return (
            '<div class="col-md-6 col-lg-4 fade-in-item">' +
              '<div class="info-card">' +
                '<div class="card-icon"><i class="fa-solid ' + (s.icon || "fa-mountain") + '"></i></div>' +
                "<h4>" + s.name + "</h4>" +
                "<p>" + s.desc + "</p>" +
                '<span class="info-tag">Difficulty: ' + (s.difficulty || "—") + "</span>" +
              "</div>" +
            "</div>"
          );
        }).join("");
        $grid.html(html || "<p class='text-center'>No styles data available.</p>");
      },
      function () {
        $("#stylesGrid").html('<p class="text-center text-muted">Unable to load styles data.</p>');
      }
    );
  }

  function renderSimpleList(gridId, list, iconClass) {
    var html = (list || []).map(function (item) {
      return (
        '<div class="col-md-6 col-lg-3 fade-in-item">' +
          '<div class="info-card">' +
            '<div class="card-icon"><i class="fa-solid ' + (item.icon || iconClass || "fa-mountain") + '"></i></div>' +
            "<h4>" + item.name + "</h4>" +
            "<p>" + item.desc + "</p>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    $(gridId).html(html || '<p class="text-center">No data available.</p>');
  }

  function renderTechniques() {
    $("#techniquesGrid").empty();
    loadJSON("data/mountaineering.json", function (d) {
      var html = (d.techniques || []).map(function (t) {
        return (
          '<div class="col-md-6 col-lg-3 fade-in-item">' +
            '<div class="info-card">' +
              '<div class="card-icon"><i class="fa-solid ' + (t.icon || "fa-circle-nodes") + '"></i></div>' +
              "<h4>" + t.name + "</h4>" +
              "<p>" + t.desc + "</p>" +
            "</div>" +
          "</div>"
        );
      }).join("");
      $("#techniquesGrid").html(html || '<p class="text-center">No techniques data available.</p>');
    });
  }

  function renderSheltering() {
    $("#shelteringGrid").empty();
    loadJSON("data/mountaineering.json", function (d) {
      var html = (d.sheltering || []).map(function (s) {
        return (
          '<div class="col-md-6 col-lg-3 fade-in-item">' +
            '<div class="info-card">' +
              '<div class="card-icon"><i class="fa-solid ' + (s.icon || "fa-campground") + '"></i></div>' +
              "<h4>" + s.name + "</h4>" +
              "<p>" + s.desc + "</p>" +
            "</div>" +
          "</div>"
        );
      }).join("");
      $("#shelteringGrid").html(html || '<p class="text-center">No sheltering data available.</p>');
    });
  }

  function renderEquipment() {
    $("#equipmentGrid").empty();
    loadJSON("data/mountaineering.json", function (d) {
      var html = (d.equipment || []).map(function (e) {
        return (
          '<div class="col-md-6 col-lg-3 fade-in-item">' +
            '<div class="info-card">' +
              '<div class="card-icon"><i class="fa-solid ' + (e.icon || "fa-toolbox") + '"></i></div>' +
              "<h4>" + e.name + "</h4>" +
              "<p>" + e.desc + "</p>" +
              '<span class="info-tag">' + (e.category || "Gear") + "</span>" +
            "</div>" +
          "</div>"
        );
      }).join("");
      $("#equipmentGrid").html(html || '<p class="text-center">No equipment data available.</p>');
    });
  }

  function renderHazards() {
    $("#hazardsGrid").empty();
    loadJSON("data/mountaineering.json", function (d) {
      var html = (d.hazards || []).map(function (h) {
        var riskCls = (h.risk || "").toLowerCase().replace(/\s/g, "-");
        var riskClsMap = { high: "risk-high", medium: "risk-medium", low: "risk-low" };
        var badgeCls = riskClsMap[riskCls] || "risk-medium";
        return (
          '<div class="col-md-6 col-lg-4 fade-in-item">' +
            '<div class="info-card hazard-card">' +
              '<div class="card-icon"><i class="fa-solid ' + (h.icon || "fa-triangle-exclamation") + '"></i></div>' +
              "<h4>" + h.name + "</h4>" +
              "<p>" + h.desc + "</p>" +
              '<span class="risk-badge ' + badgeCls + '">Risk: ' + (h.risk || "N/A") + "</span>" +
              '<div class="hazard-prevention"><strong>Prevention:</strong> ' + (h.prevention || "Follow standard safety practices.") + "</div>" +
            "</div>" +
          "</div>"
        );
      }).join("");
      $("#hazardsGrid").html(html || '<p class="text-center">No hazards data available.</p>');
    });
  }

  function renderGuidelines() {
    $("#guidelinesGrid").empty();
    loadJSON("data/mountaineering.json", function (d) {
      var icons = {
        "Preparation": "fa-list-check",
        "Climbing Safety": "fa-shield-halved",
        "Emergency Procedures": "fa-truck-medical",
        "Altitude Acclimatization": "fa-mountain-city"
      };
      var html = (d.guidelines || []).map(function (g) {
        var items = (g.items || []).map(function (it) { return "<li>" + it + "</li>"; }).join("");
        return (
          '<div class="col-md-6 fade-in-item">' +
            '<div class="guideline-card">' +
              "<h4><i class='fa-solid " + (icons[g.phase] || "fa-check") + "'></i>" + g.phase + "</h4>" +
              "<ul>" + items + "</ul>" +
            "</div>" +
          "</div>"
        );
      }).join("");
      $("#guidelinesGrid").html(html || '<p class="text-center">No guidelines available.</p>');
    });
  }

  /* ----------------------- Statistics counter ----------------------- */

  function renderStats() {
    loadJSON("data/mountaineering.json", function (d) {
      var html = (d.statistics || []).map(function (s, i) {
        return (
          '<div class="col-6 col-md-3 fade-in-item">' +
            '<div class="stat-card">' +
              '<div class="stat-icon"><i class="fa-solid ' + (s.icon || "fa-mountain") + '"></i></div>' +
              '<div class="stat-value"><span class="counter" data-target="' + s.value + '" data-suffix="' + (s.suffix || "") + '">0</span></div>' +
              '<div class="stat-label">' + s.label + "</div>" +
            "</div>" +
          "</div>"
        );
      }).join("");
      $("#statsRow").html(html || "");
      // Kick off counters after insertion
      initCounters();
    });
  }

  function initCounters() {
    var $counters = $(".counter");
    if (!$counters.length) return;

    function animate($el) {
      var target = parseInt($el.data("target"), 10) || 0;
      var suffix = $el.data("suffix") || "";
      var duration = 1800;
      var start = 0;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        $el.text(Math.floor(eased * target) + (progress === 1 ? suffix : ""));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // Animate when the stats row scrolls into view (or immediately if visible).
    var triggered = false;
    function runIfVisible() {
      if (triggered) return;
      var rect = $("#statsRow")[0].getBoundingClientRect();
      if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
        triggered = true;
        $counters.each(function () { animate($(this)); });
      }
    }
    $(window).on("scroll resize", runIfVisible);
    runIfVisible();
  }

  /* ----------------------- Reveal on scroll ----------------------- */

  function initReveal() {
    var $reveals = $(".reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-zoom");
    function check() {
      $reveals.each(function () {
        var $el = $(this);
        if ($el.hasClass("visible")) return;
        var rect = this.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60 && rect.bottom > 0) {
          $el.addClass("visible");
        }
      });
    }
    $(window).on("scroll resize", function () {
      requestAnimationFrame(check);
    });
    check();
  }

  /* ----------------------- Checklist logic ----------------------- */

  function initChecklist() {
    var $boxes = $("#climbChecklist .check-box");
    function update() {
      var total = $boxes.length;
      var done = $boxes.filter(":checked").length;
      var pct = total ? Math.round((done / total) * 100) : 0;
      $("#checklistBar").css("width", pct + "%").attr("aria-valuenow", pct);
      $("#checklistLabel").text(done + " / " + total + " complete");
    }
    $(document).on("change", ".check-box", function () {
      $(this).closest(".check-item").toggleClass("done", this.checked);
      update();
    });
    update();
  }

  /* ----------------------- Newsletter ----------------------- */

  function initNewsletter() {
    $("#newsletterForm").on("submit", function (e) {
      e.preventDefault();
      var $input = $(this).find("input[type=email]");
      var email = $input.val().trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $input.addClass("is-invalid");
        return;
      }
      $input.removeClass("is-invalid");
      $input.val("");
      var msg = $('<div class="alert alert-success mt-2">Subscribed! Welcome to the Alpine Ascents newsletter.</div>');
      $(this).after(msg);
      setTimeout(function () { msg.fadeOut(400, function () { $(this).remove(); }); }, 3000);
    });
  }

  /* ----------------------- Ticker integration (date/time) ----------------------- */
  // Actual date/time ticking is handled by ticker.js; nothing extra here.

  /* ----------------------- Boot ----------------------- */

  function init() {
    // Hide preloader once the page is ready.
    $(window).on("load", function () {
      setTimeout(function () {
        $("#page-preloader").addClass("hidden");
        $("body").addClass("loaded");
      }, 400);
    });
    // Fallback: hide preloader after 3s even if load event is slow.
    setTimeout(function () {
      $("#page-preloader").addClass("hidden");
      $("body").addClass("loaded");
    }, 3000);

    // Set footer year
    $("#footerYear").text(new Date().getFullYear());

    // Render all data-driven sections
    renderStats();
    renderStyles();
    renderTechniques();
    renderSheltering();
    renderEquipment();
    renderHazards();
    renderGuidelines();

    initReveal();
    initChecklist();
    initNewsletter();

    // Set organizations intro text from JSON
    loadJSON("data/mountaineering.json", function (d) {
      if (d.organizations_intro) $("#organizationsIntro").text(d.organizations_intro);
    });
  }

  // Expose loader to other modules (records/organizations/stories/developments/search use their own).
  window.AlpineUtils = { loadJSON: loadJSON };

  $(init);
})(window, jQuery);
