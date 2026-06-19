(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let currentSlide = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  function startCarousel() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      window.clearInterval(timer);
      showSlide(index);
      startCarousel();
    });
  });

  startCarousel();

  const searchInputs = Array.from(document.querySelectorAll('.site-search'));
  const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
  const cards = Array.from(document.querySelectorAll('.searchable-card'));
  let activeFilter = 'all';

  function textOf(card) {
    return [
      card.dataset.title || '',
      card.dataset.year || '',
      card.dataset.tags || '',
      card.textContent || ''
    ].join(' ').toLowerCase();
  }

  function applySearch() {
    const query = searchInputs.map(function (input) {
      return input.value.trim().toLowerCase();
    }).find(Boolean) || '';

    const filterTerms = activeFilter === 'all'
      ? []
      : activeFilter.toLowerCase().split(/\s+/).filter(Boolean);

    cards.forEach(function (card) {
      const haystack = textOf(card);
      const queryMatch = !query || haystack.includes(query);
      const filterMatch = !filterTerms.length || filterTerms.some(function (term) {
        return haystack.includes(term);
      });

      card.classList.toggle('is-hidden', !(queryMatch && filterMatch));
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', applySearch);
  });

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (item) {
        item.classList.remove('is-active');
      });

      button.classList.add('is-active');
      activeFilter = button.dataset.filter || 'all';
      applySearch();
    });
  });
})();
