(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var menuButton = qs("[data-menu-toggle]");
  var mobileNav = qs("[data-mobile-nav]");
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var hero = qs("[data-hero]");
  if (hero) {
    var slides = qsa("[data-hero-slide]", hero);
    var dots = qsa("[data-hero-dot]", hero);
    var active = 0;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  var filterInput = qs("[data-filter-input]");
  var filterStatus = qs("[data-filter-status]");
  if (filterInput) {
    var cards = qsa("[data-card]");
    function runFilter() {
      var value = filterInput.value.trim().toLowerCase();
      var count = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        var match = !value || text.indexOf(value) !== -1;
        card.style.display = match ? "" : "none";
        if (match) {
          count += 1;
        }
      });
      if (filterStatus) {
        filterStatus.textContent = value ? "找到 " + count + " 个相关结果" : "输入关键词可筛选当前页面内容";
      }
    }
    filterInput.addEventListener("input", runFilter);
  }

  var searchInput = qs("[data-global-search]");
  var searchResults = qs("[data-search-results]");
  if (searchInput && searchResults && window.MOVIE_SEARCH_INDEX) {
    function renderResults(items) {
      if (!items.length) {
        searchResults.innerHTML = "";
        return;
      }
      searchResults.innerHTML = items.slice(0, 12).map(function (item) {
        return [
          '<a class="search-result" href="' + item.url + '">',
          '<img src="' + item.cover + '" alt="' + item.title + '" loading="lazy">',
          '<span><strong>' + item.title + '</strong><em>' + item.year + ' · ' + item.region + ' · ' + item.genre + '</em></span>',
          '<span class="btn">查看详情</span>',
          '</a>'
        ].join("");
      }).join("");
    }

    searchInput.addEventListener("input", function () {
      var value = searchInput.value.trim().toLowerCase();
      if (!value) {
        renderResults([]);
        return;
      }
      var terms = value.split(/\s+/).filter(Boolean);
      var results = window.MOVIE_SEARCH_INDEX.filter(function (item) {
        var text = item.text.toLowerCase();
        return terms.every(function (term) {
          return text.indexOf(term) !== -1;
        });
      });
      renderResults(results);
    });
  }

  function loadHls(callback, fail) {
    if (window.Hls) {
      callback();
      return;
    }
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    script.async = true;
    script.onload = callback;
    script.onerror = fail;
    document.head.appendChild(script);
  }

  qsa("[data-player]").forEach(function (player) {
    var video = qs("video", player);
    var button = qs("[data-play-button]", player);
    var message = qs("[data-player-message]", player);
    var src = player.getAttribute("data-src");
    var started = false;

    function setMessage(text) {
      if (message) {
        message.textContent = text || "";
      }
    }

    function startPlay() {
      if (!video || !src || started) {
        return;
      }
      started = true;
      if (button) {
        button.classList.add("is-hidden");
      }

      var canNative = video.canPlayType("application/vnd.apple.mpegurl");
      if (canNative) {
        video.src = src;
        video.play().catch(function () {
          setMessage("点击视频画面继续播放");
        });
        return;
      }

      loadHls(function () {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {
              setMessage("点击视频画面继续播放");
            });
          });
          hls.on(window.Hls.Events.ERROR, function () {
            setMessage("播放暂时不可用");
          });
        } else {
          setMessage("当前浏览器暂不支持此播放方式");
        }
      }, function () {
        setMessage("播放组件加载失败");
      });
    }

    if (button) {
      button.addEventListener("click", startPlay);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (!started) {
          startPlay();
        }
      });
    }
  });
})();
