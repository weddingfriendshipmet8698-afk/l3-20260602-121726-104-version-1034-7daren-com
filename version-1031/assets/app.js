(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function setupMenu() {
    var toggle = qs('.menu-toggle');
    var mobile = qs('.mobile-nav');
    if (!toggle || !mobile) return;
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupHero() {
    var slides = qsa('.hero-slide');
    var dots = qsa('[data-hero-dot]');
    if (!slides.length) return;
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5600);
  }

  function setupFiltering() {
    var containers = qsa('[data-filter-scope]');
    containers.forEach(function (container) {
      var input = qs('[data-search-input]', container);
      var chips = qsa('[data-filter]', container);
      var cards = qsa('[data-card]', container);
      var empty = qs('[data-empty]', container);
      var active = 'all';
      var params = new URLSearchParams(window.location.search);
      var incoming = params.get('q');
      if (incoming && input) input.value = incoming;
      function apply() {
        var query = normalize(input ? input.value : '');
        var visible = 0;
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-keywords'));
          var okQuery = !query || text.indexOf(query) !== -1;
          var okChip = active === 'all' || text.indexOf(active) !== -1;
          var show = okQuery && okChip;
          card.style.display = show ? '' : 'none';
          if (show) visible += 1;
        });
        if (empty) empty.classList.toggle('is-visible', visible === 0);
      }
      if (input) input.addEventListener('input', apply);
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          active = normalize(chip.getAttribute('data-filter'));
          chips.forEach(function (item) {
            item.classList.toggle('active', item === chip);
          });
          apply();
        });
      });
      apply();
    });
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = qs('#movie-player');
    var cover = qs('.player-cover');
    var started = false;
    var hlsInstance = null;
    if (!video || !streamUrl) return;
    function attach() {
      if (!started) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
        video.setAttribute('controls', 'controls');
        started = true;
      }
      if (cover) cover.classList.add('is-hidden');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }
    if (cover) cover.addEventListener('click', attach);
    video.addEventListener('click', function () {
      if (!started) attach();
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) hlsInstance.destroy();
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFiltering();
  });
})();
