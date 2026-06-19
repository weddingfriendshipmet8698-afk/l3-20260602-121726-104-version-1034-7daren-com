(function () {
  var body = document.body;
  var menuButton = document.querySelector(".menu-toggle");

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      body.classList.toggle("menu-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector(".hero-prev");
    var next = hero.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-slide")) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        restart();
      });
    }

    restart();
  }

  var filterForm = document.querySelector("[data-filter-form]");
  var filterInput = document.querySelector("[data-filter-input]");
  var filterList = document.querySelector(".filter-list");

  if (filterForm && filterInput && filterList) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (query) {
      filterInput.value = query;
      filterCards(query);
    }

    filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      filterCards(filterInput.value);
    });

    filterInput.addEventListener("input", function () {
      filterCards(filterInput.value);
    });
  }

  function filterCards(value) {
    var keyword = String(value || "").trim().toLowerCase();
    var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-list .movie-card"));

    cards.forEach(function (card) {
      var text = [
        card.getAttribute("data-title"),
        card.getAttribute("data-year"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre"),
        card.textContent
      ].join(" ").toLowerCase();
      card.hidden = keyword && text.indexOf(keyword) === -1;
    });
  }

  var tableForm = document.querySelector("[data-table-filter]");
  var tableInput = document.querySelector("[data-table-filter-input]");

  if (tableForm && tableInput) {
    tableForm.addEventListener("submit", function (event) {
      event.preventDefault();
      filterTable(tableInput.value);
    });

    tableInput.addEventListener("input", function () {
      filterTable(tableInput.value);
    });
  }

  function filterTable(value) {
    var keyword = String(value || "").trim().toLowerCase();
    var rows = Array.prototype.slice.call(document.querySelectorAll(".rank-table tbody tr"));

    rows.forEach(function (row) {
      row.hidden = keyword && row.textContent.toLowerCase().indexOf(keyword) === -1;
    });
  }

  var player = document.querySelector(".js-player");
  var cover = document.querySelector(".js-player-cover");

  if (player && cover && window.__streamUrl) {
    var started = false;
    var hlsInstance = null;

    function startVideo() {
      if (!started) {
        if (player.canPlayType("application/vnd.apple.mpegurl")) {
          player.src = window.__streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls();
          hlsInstance.loadSource(window.__streamUrl);
          hlsInstance.attachMedia(player);
        } else {
          player.src = window.__streamUrl;
        }
        started = true;
      }

      cover.classList.add("is-hidden");
      player.play().catch(function () {});
    }

    cover.addEventListener("click", startVideo);
    player.addEventListener("click", function () {
      if (!started) {
        startVideo();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
