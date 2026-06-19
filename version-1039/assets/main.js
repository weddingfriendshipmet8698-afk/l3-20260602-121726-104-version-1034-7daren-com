(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let active = 0;
    let timer = null;

    const show = function (index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };

    const start = function () {
      if (timer || slides.length < 2) {
        return;
      }
      timer = setInterval(function () {
        show(active + 1);
      }, 5200);
    };

    const stop = function () {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    if (prev) {
      prev.addEventListener('click', function () {
        stop();
        show(active - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        stop();
        show(active + 1);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        stop();
        show(index);
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  const filterForm = document.querySelector('[data-filter-form]');
  if (filterForm) {
    const input = filterForm.querySelector('[data-filter-keyword]');
    const region = filterForm.querySelector('[data-filter-region]');
    const year = filterForm.querySelector('[data-filter-year]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const empty = document.querySelector('[data-empty-state]');

    const apply = function () {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const regionValue = region ? region.value : '';
      const yearValue = year ? year.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        const okKeyword = !keyword || text.indexOf(keyword) !== -1;
        const okRegion = !regionValue || card.getAttribute('data-region') === regionValue;
        const okYear = !yearValue || card.getAttribute('data-year') === yearValue;
        const matched = okKeyword && okRegion && okYear;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    };

    ['input', 'change'].forEach(function (eventName) {
      filterForm.addEventListener(eventName, apply);
    });
    apply();
  }
})();

function initPlayer(videoId, buttonId, streamUrl) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  if (!video || !button || !streamUrl) {
    return;
  }

  let attached = false;
  let hls = null;

  const attach = function () {
    if (attached) {
      return;
    }
    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return;
    }

    video.src = streamUrl;
  };

  const start = function () {
    attach();
    button.classList.add('is-hidden');
    const playResult = video.play();
    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {
        button.classList.remove('is-hidden');
      });
    }
  };

  button.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });
  video.addEventListener('pause', function () {
    if (!video.ended) {
      button.classList.remove('is-hidden');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
