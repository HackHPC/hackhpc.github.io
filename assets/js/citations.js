// Citation modal: "View Citation" (APA / IEEE / BibTeX) with share, copy, and .bib download.
// Expects a <script type="application/json" id="citationsData"> blob keyed by citation_key,
// each value: { title, source, apa, ieee, bibtex, key }
(function () {
  var dataEl = document.getElementById('citationsData');
  var backdrop = document.getElementById('citationModalBackdrop');
  if (!dataEl || !backdrop) return;

  var citations = JSON.parse(dataEl.textContent);
  var titleEl = document.getElementById('citationModalTitle');
  var sourceEl = document.getElementById('citationModalSource');
  var textEl = document.getElementById('citationModalText');
  var statusEl = document.getElementById('citationModalStatus');
  var tabs = backdrop.querySelectorAll('.citation-tab');
  var closeBtn = document.getElementById('citationModalClose');
  var shareBtn = document.getElementById('citationShareBtn');
  var copyBtn = document.getElementById('citationCopyBtn');
  var downloadBtn = document.getElementById('citationDownloadBtn');

  var current = null; // { entry, format }

  function textFor(entry, format) {
    if (format === 'apa') return entry.apa;
    if (format === 'ieee') return entry.ieee;
    return entry.bibtex;
  }

  function setStatus(msg) {
    statusEl.textContent = msg;
    if (msg) setTimeout(function () { if (statusEl.textContent === msg) statusEl.textContent = ''; }, 3000);
  }

  function setFormat(format) {
    if (!current) return;
    current.format = format;
    tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.format === format); });
    textEl.textContent = textFor(current.entry, format);
  }

  function openModal(key, format) {
    var entry = citations[key];
    if (!entry) return;
    current = { entry: entry, format: format };
    titleEl.textContent = 'Cite: ' + entry.title;
    sourceEl.textContent = entry.source || '';
    setFormat(format);
    backdrop.classList.add('open');
    closeBtn.focus();
  }

  function closeModal() {
    backdrop.classList.remove('open');
    current = null;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.cite-btn');
    if (btn) openModal(btn.dataset.key, btn.dataset.format);
  });

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { setFormat(t.dataset.format); });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  copyBtn.addEventListener('click', function () {
    if (!current) return;
    var text = textFor(current.entry, current.format);
    navigator.clipboard.writeText(text).then(function () {
      setStatus('Copied to clipboard.');
    }, function () {
      setStatus('Could not copy — select the text above manually.');
    });
  });

  shareBtn.addEventListener('click', function () {
    if (!current) return;
    var text = textFor(current.entry, current.format);
    if (navigator.share) {
      navigator.share({ title: current.entry.title, text: text }).catch(function () {});
    } else {
      navigator.clipboard.writeText(text).then(function () {
        setStatus('Sharing isn\'t supported here — citation copied instead.');
      });
    }
  });

  downloadBtn.addEventListener('click', function () {
    if (!current) return;
    var blob = new Blob([current.entry.bibtex], { type: 'application/x-bibtex' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = current.entry.key + '.bib';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus('Downloaded ' + current.entry.key + '.bib');
  });
})();
