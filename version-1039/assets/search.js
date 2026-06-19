(function () {
  const form = document.querySelector('[data-site-search]');
  const input = document.querySelector('[data-site-search-input]');
  const results = document.querySelector('[data-search-results]');
  const empty = document.querySelector('[data-search-empty]');
  if (!form || !input || !results || !Array.isArray(window.SEARCH_ITEMS || SEARCH_ITEMS)) {
    return;
  }

  const items = window.SEARCH_ITEMS || SEARCH_ITEMS;
  const params = new URLSearchParams(window.location.search);
  const initial = params.get('q') || '';
  input.value = initial;

  const card = function (item) {
    return [
      '<article class="movie-card">',
      '<a href="' + item.url + '">',
      '<div class="poster-wrap">',
      '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '<span class="badge">' + escapeHtml(item.year) + '</span>',
      '<div class="poster-shade"><span class="play-chip">▶ 观看</span></div>',
      '</div>',
      '<div class="card-body">',
      '<h3 class="card-title">' + escapeHtml(item.title) + '</h3>',
      '<p class="card-desc">' + escapeHtml(item.desc) + '</p>',
      '<div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
      '</div>',
      '</a>',
      '</article>'
    ].join('');
  };

  const render = function () {
    const q = input.value.trim().toLowerCase();
    const matched = items.filter(function (item) {
      const text = [item.title, item.region, item.type, item.year, item.genre, item.tags, item.desc].join(' ').toLowerCase();
      return !q || text.indexOf(q) !== -1;
    }).slice(0, 96);

    results.innerHTML = matched.map(card).join('');
    if (empty) {
      empty.style.display = matched.length ? 'none' : 'block';
    }
  };

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const q = input.value.trim();
    const url = q ? 'search.html?q=' + encodeURIComponent(q) : 'search.html';
    window.history.replaceState(null, '', url);
    render();
  });

  input.addEventListener('input', render);
  render();

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[char];
    });
  }
})();
