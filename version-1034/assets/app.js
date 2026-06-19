document.addEventListener("DOMContentLoaded", function () {
    initMobileNavigation();
    initHeroSlider();
    initFilters();
    initLazyImageFallbacks();
    initPlayer();
});

function initMobileNavigation() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
    });
}

function initHeroSlider() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var panelImage = document.querySelector("[data-hero-panel-image]");
    var panelTitle = document.querySelector("[data-hero-panel-title]");
    var panelText = document.querySelector("[data-hero-panel-text]");
    var panelLink = document.querySelector("[data-hero-panel-link]");
    var current = 0;

    if (!slides.length) {
        return;
    }

    function setSlide(index) {
        current = index % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === current);
        });

        var activeSlide = slides[current];
        if (panelImage && activeSlide.dataset.cover) {
            panelImage.src = activeSlide.dataset.cover;
            panelImage.alt = activeSlide.dataset.title || "";
        }
        if (panelTitle) {
            panelTitle.textContent = activeSlide.dataset.title || "";
        }
        if (panelText) {
            panelText.textContent = activeSlide.dataset.line || "";
        }
        if (panelLink && activeSlide.dataset.href) {
            panelLink.href = activeSlide.dataset.href;
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            setSlide(index);
        });
    });

    setSlide(0);

    window.setInterval(function () {
        setSlide(current + 1);
    }, 5200);
}

function initFilters() {
    var filterRoot = document.querySelector("[data-filter-root]");

    if (!filterRoot) {
        return;
    }

    var keywordInput = filterRoot.querySelector("[data-search-input]");
    var yearSelect = filterRoot.querySelector("[data-year-select]");
    var regionSelect = filterRoot.querySelector("[data-region-select]");
    var items = Array.prototype.slice.call(filterRoot.querySelectorAll(".searchable-item"));
    var empty = filterRoot.querySelector("[data-no-results]");

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function applyFilters() {
        var keyword = normalize(keywordInput && keywordInput.value);
        var year = yearSelect ? yearSelect.value : "";
        var region = regionSelect ? regionSelect.value : "";
        var visibleCount = 0;

        items.forEach(function (item) {
            var text = normalize(
                item.dataset.title + " " +
                item.dataset.region + " " +
                item.dataset.genre + " " +
                item.textContent
            );
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchYear = !year || item.dataset.year === year;
            var matchRegion = !region || item.dataset.region === region;
            var visible = matchKeyword && matchYear && matchRegion;

            item.style.display = visible ? "" : "none";
            if (visible) {
                visibleCount += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("visible", visibleCount === 0);
        }
    }

    [keywordInput, yearSelect, regionSelect].forEach(function (control) {
        if (control) {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        }
    });

    applyFilters();
}

function initLazyImageFallbacks() {
    var images = Array.prototype.slice.call(document.querySelectorAll("img"));

    images.forEach(function (image) {
        image.addEventListener("error", function () {
            var shell = image.closest(".poster-wrap, .hero-poster, .detail-poster");
            if (shell) {
                shell.classList.add("image-missing");
            }
        });
    });
}

function initPlayer() {
    var playerBox = document.querySelector("[data-player-box]");
    var video = document.querySelector("[data-video-player]");
    var overlay = document.querySelector("[data-player-overlay]");

    if (!playerBox || !video || !overlay) {
        return;
    }

    function startPlayer() {
        var source = video.dataset.src;

        if (!source) {
            return;
        }

        playerBox.classList.add("ready");

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.addEventListener("loadedmetadata", function () {
                video.play().catch(function () {});
            }, { once: true });
        } else {
            video.src = source;
            video.play().catch(function () {});
        }
    }

    overlay.addEventListener("click", startPlayer);
    video.addEventListener("play", function () {
        playerBox.classList.add("playing");
    });
}
