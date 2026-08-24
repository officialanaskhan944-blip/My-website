/* ==========================================================================
   Alpine Ascents — gallery.js
   Renders the image gallery (with category filters and lightbox) and
   informative videos (in a Bootstrap modal).
   ========================================================================== */

(function (window, $) {
  "use strict";

  var gallery = [];
  var videos = [];
  var filtered = [];
  var currentIndex = 0;
  var currentFilter = "all";

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function renderGallery() {
    if (!filtered.length) {
      $("#galleryGrid").html('<p class="text-center text-muted py-4">No images in this category.</p>');
      return;
    }
    var html = filtered.map(function (g, idx) {
      return (
        '<div class="gallery-item fade-in-item" data-idx="' + idx + '">' +
          '<img src="' + escapeHtml(g.image) + '" alt="' + escapeHtml(g.alt || g.title) + '" loading="lazy" ' +
            'onerror="this.onerror=null;this.src=\'https://picsum.photos/seed/g' + g.id + '/600/400\';">' +
          '<div class="gallery-overlay">' +
            '<div class="gallery-zoom"><i class="fa-solid fa-expand"></i></div>' +
            "<h5>" + escapeHtml(g.title) + "</h5>" +
            "<p>" + escapeHtml(g.caption) + "</p>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    $("#galleryGrid").html(html);
  }

  function renderVideos() {
    if (!videos.length) {
      $("#videosGrid").html('<div class="col-12 text-center text-muted py-4">No videos available.</div>');
      return;
    }
    var html = videos.map(function (v, i) {
      return (
        '<div class="col-md-4 fade-in-item">' +
          '<div class="video-card" data-video-index="' + i + '">' +
            '<div class="video-thumb">' +
              '<img src="' + escapeHtml(v.thumbnail) + '" alt="' + escapeHtml(v.title) + '" loading="lazy" ' +
                'onerror="this.onerror=null;this.src=\'https://picsum.photos/seed/v' + v.id + '/600/360\';">' +
              '<div class="video-play"><span><i class="fa-solid fa-play"></i></span></div>' +
              '<span class="video-duration">' + escapeHtml(v.duration) + "</span>" +
            "</div>" +
            '<div class="video-body">' +
              "<h5>" + escapeHtml(v.title) + "</h5>" +
              "<p>" + escapeHtml(v.desc) + "</p>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    $("#videosGrid").html(html);
  }

  /* ---- Lightbox ---- */
  function openLightbox(idx) {
    currentIndex = idx;
    updateLightbox();
    $("#lightbox").addClass("open").attr("aria-hidden", "false");
    $("body").css("overflow", "hidden");
  }

  function updateLightbox() {
    var g = filtered[currentIndex];
    if (!g) return;
    $("#lightboxImg").attr("src", g.image).attr("alt", g.alt || g.title);
    $("#lightboxCaption").text(g.caption || g.title);
  }

  function closeLightbox() {
    $("#lightbox").removeClass("open").attr("aria-hidden", "true");
    $("body").css("overflow", "");
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % filtered.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
    updateLightbox();
  }

  /* ---- Video modal ---- */
  function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? "https://www.youtube.com/embed/" + match[2] : url;
  }

  function openVideo(index) {
    var v = videos[index];
    if (!v) return;
    $("#videoModalTitle").text(v.title);
    $("#videoFrame").attr("src", getYouTubeEmbedUrl(v.source));
    var modal = new bootstrap.Modal(document.getElementById("videoModal"));
    modal.show();
  }

  function init() {
    $.ajax({ url: "data/gallery.json", dataType: "json", timeout: 10000 })
      .done(function (d) {
        gallery = d.gallery || [];
        videos = d.videos || [];
        filtered = gallery.slice();
        renderGallery();
        renderVideos();
      })
      .fail(function () {
        $("#galleryGrid").html(
          '<p class="text-center text-muted py-4">Unable to load gallery data.</p>'
        );
        $("#videosGrid").html("");
      });

    // Category filtering
    $(document).on("click", ".filter-btn", function () {
      $(".filter-btn").removeClass("active");
      $(this).addClass("active");
      currentFilter = $(this).data("filter");
      filtered = currentFilter === "all"
        ? gallery.slice()
        : gallery.filter(function (g) { return g.category === currentFilter; });
      renderGallery();
    });

    // Lightbox open
    $(document).on("click", ".gallery-item", function () {
      openLightbox(parseInt($(this).data("idx"), 10));
    });

    // Lightbox controls
    $("#lightboxClose").on("click", closeLightbox);
    $("#lightboxNext").on("click", nextImage);
    $("#lightboxPrev").on("click", prevImage);
    $(document).on("keydown", function (e) {
      if (!$("#lightbox").hasClass("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    });

    // Video open
    $(document).on("click", ".video-card", function () {
      openVideo(parseInt($(this).data("video-index"), 10));
    });

    // Clear iframe on video modal close (stop playback)
    $("#videoModal").on("hidden.bs.modal", function () {
      $("#videoFrame").attr("src", "");
    });
  }

  $(init);
})(window, jQuery);