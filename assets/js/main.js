// Mobile nav toggle
(function () {
  var hamburger = document.getElementById('hamburger');
  var menu = document.getElementById('navbarMenu');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', function () {
    var isActive = menu.classList.toggle('active');
    hamburger.classList.toggle('active', isActive);
    hamburger.setAttribute('aria-expanded', isActive);
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Events archive filter/search (progressive enhancement over server-rendered cards)
(function () {
  var grid = document.getElementById('eventsGrid');
  if (!grid) return;

  var searchInput = document.getElementById('eventSearch');
  var typeFilter = document.getElementById('typeFilter');
  var yearFilter = document.getElementById('yearFilter');
  var resultsCount = document.getElementById('resultsCount');
  var noResults = document.getElementById('noResults');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.event-card'));

  function applyFilters() {
    var query = (searchInput.value || '').toLowerCase().trim();
    var type = typeFilter.value;
    var year = yearFilter.value;
    var visible = 0;

    cards.forEach(function (card) {
      var matchesQuery = !query || card.dataset.search.indexOf(query) !== -1;
      var matchesType = !type || card.dataset.type === type;
      var matchesYear = !year || card.dataset.year === year;
      var show = matchesQuery && matchesType && matchesYear;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    resultsCount.textContent = visible + (visible === 1 ? ' event' : ' events');
    noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input', applyFilters);
  typeFilter.addEventListener('change', applyFilters);
  yearFilter.addEventListener('change', applyFilters);
  applyFilters();
})();
