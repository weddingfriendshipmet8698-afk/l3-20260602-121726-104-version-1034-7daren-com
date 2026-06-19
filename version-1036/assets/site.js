(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      const open = mobileNav.hasAttribute("hidden");
      if (open) {
        mobileNav.removeAttribute("hidden");
      } else {
        mobileNav.setAttribute("hidden", "");
      }
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  let current = 0;

  function setSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === current);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      setSlide(Number(dot.getAttribute("data-slide") || 0));
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      setSlide(current + 1);
    }, 5200);
  }

  const input = document.querySelector(".search-input");
  const year = document.querySelector(".year-filter");
  const scope = document.querySelector(".search-scope");

  function filterCards() {
    if (!scope) return;
    const q = input ? input.value.trim().toLowerCase() : "";
    const y = year ? year.value : "";
    const cards = Array.from(scope.querySelectorAll("[data-title]"));
    cards.forEach(function (card) {
      const text = [
        card.getAttribute("data-title"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year")
      ].join(" ").toLowerCase();
      const matchText = !q || text.indexOf(q) >= 0;
      const matchYear = !y || card.getAttribute("data-year") === y;
      card.classList.toggle("is-filtered-out", !(matchText && matchYear));
    });
  }

  if (input) input.addEventListener("input", filterCards);
  if (year) year.addEventListener("change", filterCards);
})();
