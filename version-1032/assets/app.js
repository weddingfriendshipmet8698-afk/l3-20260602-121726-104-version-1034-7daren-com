(function () {
    function qs(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var button = qs('[data-menu-toggle]');
        var nav = qs('[data-nav-links]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    function setupHero() {
        var slides = qsa('[data-hero-slide]');
        var dots = qsa('[data-hero-dot]');
        if (!slides.length) {
            return;
        }
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
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });
        window.setInterval(function () {
            show(current + 1);
        }, 5600);
    }

    function setupSearch() {
        var inputs = qsa('[data-page-search]');
        if (!inputs.length) {
            return;
        }
        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                var keyword = input.value.trim().toLowerCase();
                var list = input.closest('main') || document;
                var cards = qsa('[data-title]', list);
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute('data-title') || '',
                        card.getAttribute('data-tags') || '',
                        card.getAttribute('data-year') || '',
                        card.textContent || ''
                    ].join(' ').toLowerCase();
                    card.classList.toggle('is-hidden', keyword && haystack.indexOf(keyword) === -1);
                });
            });
        });
    }

    function setupSort() {
        var select = qs('[data-sort-select]');
        var list = qs('[data-card-list]');
        if (!select || !list) {
            return;
        }
        select.addEventListener('change', function () {
            var cards = qsa('[data-title]', list);
            var mode = select.value;
            cards.sort(function (a, b) {
                if (mode === 'title') {
                    return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
                }
                if (mode === 'rating') {
                    var ar = Number((a.textContent.match(/评分\s*([0-9.]+)/) || [0, 0])[1]);
                    var br = Number((b.textContent.match(/评分\s*([0-9.]+)/) || [0, 0])[1]);
                    return br - ar;
                }
                return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
            });
            cards.forEach(function (card) {
                list.appendChild(card);
            });
        });
    }

    function setupPlayer() {
        var video = qs('#movie-video');
        var button = qs('[data-play-button]');
        if (!video || !button) {
            return;
        }
        var url = video.getAttribute('data-video');
        var started = false;
        function init() {
            if (!url) {
                return Promise.resolve();
            }
            if (!started) {
                started = true;
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                } else {
                    video.src = url;
                }
            }
            button.classList.add('is-hidden');
            return video.play().catch(function () {
                button.classList.remove('is-hidden');
            });
        }
        button.addEventListener('click', init);
        video.addEventListener('click', function () {
            if (video.paused) {
                init();
            }
        });
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            button.classList.remove('is-hidden');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupSearch();
        setupSort();
        setupPlayer();
    });
})();
