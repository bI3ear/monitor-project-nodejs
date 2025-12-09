async function fetchMetrics() {
  const statusEl = document.getElementById('service-status');
  const lastUpdatedEl = document.getElementById('last-updated');
  const scrapeResultEl = document.getElementById('scrape-result');
  const metricsRawEl = document.getElementById('metrics-raw');

  statusEl.textContent = 'Refreshing...';
  statusEl.classList.remove('ok', 'error');

  try {
    const res = await fetch('/metrics', { cache: 'no-store' });
    const text = await res.text();

    const now = new Date();
    lastUpdatedEl.textContent = now.toLocaleString();
    scrapeResultEl.textContent = res.ok ? 'OK' : `HTTP ${res.status}`;
    metricsRawEl.textContent = text;

    if (res.ok) {
      statusEl.textContent = 'Up';
      statusEl.classList.add('ok');
    } else {
      statusEl.textContent = 'Error';
      statusEl.classList.add('error');
    }
  } catch (err) {
    const now = new Date();
    lastUpdatedEl.textContent = now.toLocaleString();
    scrapeResultEl.textContent = 'Request failed';
    metricsRawEl.textContent = String(err);

    statusEl.textContent = 'Down';
    statusEl.classList.add('error');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refresh-btn');
  refreshBtn.addEventListener('click', fetchMetrics);

  // Initial fetch and auto-refresh every 15 seconds
  fetchMetrics();
  setInterval(fetchMetrics, 15000);
});
