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
  var teamFilter = document.getElementById('teamFilter');
  var resultsCount = document.getElementById('resultsCount');
  var noResults = document.getElementById('noResults');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.event-card'));

  function applyFilters() {
    var query = (searchInput.value || '').toLowerCase().trim();
    var type = typeFilter.value;
    var year = yearFilter.value;
    var teamEventId = teamFilter ? teamFilter.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var matchesQuery = !query || card.dataset.search.indexOf(query) !== -1;
      var matchesType = !type || card.dataset.type === type;
      var matchesYear = !year || card.dataset.year === year;
      var matchesTeam = !teamEventId || card.dataset.eventId === teamEventId;
      var show = matchesQuery && matchesType && matchesYear && matchesTeam;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    resultsCount.textContent = visible + (visible === 1 ? ' event' : ' events');
    noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input', applyFilters);
  typeFilter.addEventListener('change', applyFilters);
  yearFilter.addEventListener('change', applyFilters);

  if (teamFilter) {
    teamFilter.addEventListener('change', function () {
      applyFilters();
      var eventId = teamFilter.value;
      if (!eventId) return;

      var card = grid.querySelector('[data-event-id="' + eventId + '"]');
      if (!card) return;

      var teamName = teamFilter.options[teamFilter.selectedIndex].textContent.split(' — ')[0];
      var toggle = card.querySelector('.teams-toggle');
      if (toggle) toggle.open = true;
      var teamItem = Array.prototype.slice.call(card.querySelectorAll('.team-name'))
        .find(function (el) { return el.textContent === teamName; });

      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      card.classList.add('event-card--highlight');
      if (teamItem) teamItem.closest('.team-item').classList.add('team-item--highlight');
      setTimeout(function () {
        card.classList.remove('event-card--highlight');
        if (teamItem) teamItem.closest('.team-item').classList.remove('team-item--highlight');
      }, 2500);
    });
  }

  applyFilters();
})();

// FacultyHack modified-courses filter/search (Resources page)
(function () {
  var grid = document.getElementById('coursesGrid');
  if (!grid) return;

  var searchInput = document.getElementById('courseSearch');
  var eventFilter = document.getElementById('courseEventFilter');
  var resultsCount = document.getElementById('courseResultsCount');
  var noResults = document.getElementById('coursesNoResults');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.course-card'));

  function applyFilters() {
    var query = (searchInput.value || '').toLowerCase().trim();
    var eventId = eventFilter.value;
    var visible = 0;

    cards.forEach(function (card) {
      var matchesQuery = !query || card.dataset.search.indexOf(query) !== -1;
      var matchesEvent = !eventId || card.dataset.event === eventId;
      var show = matchesQuery && matchesEvent;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    resultsCount.textContent = visible + (visible === 1 ? ' course' : ' courses');
    noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input', applyFilters);
  eventFilter.addEventListener('change', applyFilters);
  applyFilters();
})();

// Participating schools search (Partners page)
(function () {
  var grid = document.getElementById('schoolsGrid');
  if (!grid) return;

  var searchInput = document.getElementById('schoolSearch');
  var resultsCount = document.getElementById('schoolResultsCount');
  var noResults = document.getElementById('schoolsNoResults');
  var items = Array.prototype.slice.call(grid.querySelectorAll('.school-item'));

  function applyFilter() {
    var query = (searchInput.value || '').toLowerCase().trim();
    var visible = 0;

    items.forEach(function (item) {
      var show = !query || item.dataset.search.indexOf(query) !== -1;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    resultsCount.textContent = visible + (visible === 1 ? ' school' : ' schools');
    noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input', applyFilter);
  applyFilter();
})();
