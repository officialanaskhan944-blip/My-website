/* ==========================================================================
   Alpine Ascents — stories.js
   Loads and renders success stories with a Bootstrap modal for details.
   ========================================================================== */

(function (window, $) {
  "use strict";

  var stories = [];

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function render() {
    var $grid = $("#storiesGrid");
    if (!stories.length) {
      $grid.html('<div class="col-12 text-center text-muted py-4">No stories available.</div>');
      return;
    }
    var html = stories.map(function (s, i) {
      return (
        '<div class="col-md-6 col-lg-4 fade-in-item">' +
          '<div class="story-card">' +
            '<div class="story-img-wrap">' +
              '<img src="' + escapeHtml(s.image) + '" alt="' + escapeHtml(s.alt || s.title) + '" loading="lazy" ' +
                'onerror="this.onerror=null;this.src=\'https://picsum.photos/seed/story' + i + '/600/400\';">' +
              '<span class="story-date">' + escapeHtml(s.date) + "</span>" +
            "</div>" +
            '<div class="story-body">' +
              "<h4>" + escapeHtml(s.title) + "</h4>" +
              '<div class="story-loc"><i class="fa-solid fa-location-dot"></i>' + escapeHtml(s.location) + "</div>" +
              "<p>" + escapeHtml(s.achievement) + "</p>" +
              '<div class="story-links">' +
                '<button class="btn-read" data-story-index="' + i + '">Read Full Story <i class="fa-solid fa-arrow-right"></i></button>' +
                '<span class="story-participants"><i class="fa-solid fa-user-group"></i> ' + escapeHtml(s.participants) + "</span>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    $grid.html(html);
  }

  function showStory(index) {
    var s = stories[index];
    if (!s) return;
    $("#storyModalTitle").text(s.title);
    var body =
      '<img class="story-detail-img" src="' + escapeHtml(s.image) + '" alt="' + escapeHtml(s.alt || s.title) + '" ' +
        'onerror="this.onerror=null;this.src=\'https://picsum.photos/seed/story' + index + '/800/500\';">' +
      '<div class="story-detail-meta">' +
        '<span><i class="fa-solid fa-location-dot"></i>' + escapeHtml(s.location) + "</span>" +
        '<span><i class="fa-solid fa-user-group"></i>' + escapeHtml(s.participants) + "</span>" +
        '<span><i class="fa-solid fa-hourglass-half"></i>' + escapeHtml(s.duration) + "</span>" +
        '<span><i class="fa-solid fa-calendar-days"></i>' + escapeHtml(s.date) + "</span>" +
      "</div>" +
      "<h5>Achievement</h5><p>" + escapeHtml(s.achievement) + "</p>" +
      "<h5>Story</h5><p>" + escapeHtml(s.details) + "</p>";

    $("#storyModalBody").html(body);
    var modal = new bootstrap.Modal(document.getElementById("storyModal"));
    modal.show();
  }

  function init() {
    $.ajax({ url: "data/stories.json", dataType: "json", timeout: 10000 })
      .done(function (d) {
        stories = d.stories || [];
        render();
      })
      .fail(function () {
        $("#storiesGrid").html(
          '<div class="col-12 text-center text-muted py-4">Unable to load success stories.</div>'
        );
      });

    $(document).on("click", "[data-story-index]", function () {
      showStory(parseInt($(this).data("story-index"), 10));
    });
  }

  $(init);
})(window, jQuery);
