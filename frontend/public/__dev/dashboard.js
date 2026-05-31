/**
 * Dev Control Dashboard — Self-contained JS. Zero coupling to app code.
 * Reads generated JSON from ./data/ and renders read-only triage UI.
 */

(async function () {
  'use strict';

  // ── Fetch data ──────────────────────────────────────────────
  let summary, crs, bugs, debt;
  try {
    [summary, crs, bugs, debt] = await Promise.all([
      fetch('./data/summary.json').then(r => r.json()),
      fetch('./data/crs.json').then(r => r.json()),
      fetch('./data/bugs.json').then(r => r.json()),
      fetch('./data/debt.json').then(r => r.json()),
    ]);
  } catch (e) {
    document.getElementById('content').innerHTML =
      '<div class="no-data">Failed to load dashboard data. Run: <code>node control/gen_dashboard_data.js</code></div>';
    return;
  }

  // ── Populate topbar ─────────────────────────────────────────
  document.getElementById('gen-time').textContent =
    'Generated: ' + new Date(summary.generated_at).toLocaleString();
  document.getElementById('branch-tag').textContent =
    summary.branch || '';

  // ── Summary cards ───────────────────────────────────────────
  const cardsEl = document.getElementById('summary-cards');
  const cards = [
    { value: summary.totals.crs, label: 'Total CRs', color: 'blue' },
    { value: summary.totals.bugs, label: 'Total Bugs', color: 'orange' },
    { value: summary.totals.debt, label: 'Closure Debt', color: 'red' },
    { value: summary.signoff_pending, label: 'Signoff Pending', color: 'purple' },
    { value: summary.crs_by_status.CLOSED || 0, label: 'CRs Closed', color: 'green' },
    { value: summary.crs_by_status.PLANNED || 0, label: 'CRs Planned', color: 'cyan' },
    { value: summary.bugs_by_status.OPEN || 0, label: 'Bugs Open', color: 'red' },
    { value: summary.bugs_by_status.ACCEPTED || 0, label: 'Bugs Accepted', color: 'orange' },
  ];
  cardsEl.innerHTML = cards.map(c =>
    `<div class="summary-card">
      <div class="card-value ${c.color}">${c.value}</div>
      <div class="card-label">${c.label}</div>
    </div>`
  ).join('');

  // ── Tab switching ───────────────────────────────────────────
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      applyFilters();
    });
  });

  // ── Populate filters ────────────────────────────────────────
  const sprintFilter = document.getElementById('sprint-filter');
  const severityFilter = document.getElementById('severity-filter');
  const statusFilter = document.getElementById('status-filter');
  const searchInput = document.getElementById('search-input');

  summary.sprints.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.key;
    opt.textContent = `${s.key}: ${s.name}`;
    sprintFilter.appendChild(opt);
  });
  // Add "Unassigned"
  const uOpt = document.createElement('option');
  uOpt.value = '__unassigned__';
  uOpt.textContent = 'Unassigned';
  sprintFilter.appendChild(uOpt);

  ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    severityFilter.appendChild(opt);
  });

  const allStatuses = new Set();
  [...crs, ...bugs].forEach(i => allStatuses.add(i.status));
  [...allStatuses].sort().forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    statusFilter.appendChild(opt);
  });

  // ── Badge helpers ───────────────────────────────────────────
  function badge(text, prefix) {
    if (!text) return '';
    const cls = prefix + '-' + text.toLowerCase().replace(/\s/g, '_');
    return `<span class="badge ${cls}">${text}</span>`;
  }

  function artifactBadge(status) {
    return badge(status, 'badge');
  }

  function completenessBar(c) {
    const color = c.pct === 100 ? 'var(--accent-green)' :
      c.pct >= 70 ? 'var(--accent-orange)' : 'var(--accent-red)';
    return `<span class="completeness-bar">
      <span class="bar"><span class="bar-fill" style="width:${c.pct}%;background:${color}"></span></span>
      ${c.done}/${c.total}
    </span>`;
  }

  // ── Expand/collapse ─────────────────────────────────────────
  function toggleRow(id) {
    const detail = document.getElementById('detail-' + id);
    const icon = document.getElementById('icon-' + id);
    if (detail) {
      detail.classList.toggle('open');
      icon?.classList.toggle('open');
    }
  }
  window.toggleRow = toggleRow;

  // ── Render artifact list ────────────────────────────────────
  function renderArtifacts(refs) {
    return `<ul class="artifact-list">${refs.map(a => {
      const statusBadge = artifactBadge(a.status);
      const link = a.path
        ? `<a href="#" title="${a.path}">${a.path.split('/').pop()}</a>`
        : '<span style="color:var(--text-muted)">—</span>';
      return `<li>${statusBadge} <strong>${a.label}</strong> ${link}</li>`;
    }).join('')}</ul>`;
  }

  // ── Render tables ───────────────────────────────────────────
  function renderDebtTable(items) {
    if (!items.length) return '<div class="no-data">No closure debt. All artifacts accounted for.</div>';
    return `<table class="data-table">
      <thead><tr>
        <th></th><th>ID</th><th>Type</th><th>Title</th><th>Status</th><th>Sprint</th><th>Debt Reasons</th>
      </tr></thead>
      <tbody>${items.map(d => `
        <tr class="expandable" onclick="toggleRow('${d.id}')">
          <td><span class="expand-icon" id="icon-${d.id}">&#9654;</span></td>
          <td style="font-family:var(--font-mono);font-size:12px;white-space:nowrap">${d.id}</td>
          <td>${badge(d.type, 'badge')}</td>
          <td>${d.title}</td>
          <td>${badge(d.status, 'badge')}</td>
          <td style="font-size:11px;color:var(--text-muted)">${d.sprint_name || '—'}</td>
          <td><div class="debt-reasons">${d.debt_reasons.map(r =>
            `<span class="debt-reason-tag">${r}</span>`).join('')}</div></td>
        </tr>
        <tr class="detail-row"><td colspan="7"><div class="detail-content" id="detail-${d.id}">
          <strong>Missing:</strong> ${d.missing_count} &nbsp; <strong>Pending:</strong> ${d.pending_count}
        </div></td></tr>
      `).join('')}</tbody>
    </table>`;
  }

  function renderBugTable(items) {
    if (!items.length) return '<div class="no-data">No bugs match filters.</div>';
    return `<table class="data-table">
      <thead><tr>
        <th></th><th>ID</th><th>Severity</th><th>Title</th><th>Status</th><th>Sprint</th><th>Files</th><th>Artifacts</th>
      </tr></thead>
      <tbody>${items.map(b => `
        <tr class="expandable" onclick="toggleRow('${b.id}')">
          <td><span class="expand-icon" id="icon-${b.id}">&#9654;</span></td>
          <td style="font-family:var(--font-mono);font-size:12px;white-space:nowrap">${b.id}</td>
          <td>${badge(b.severity, 'badge')}</td>
          <td>${b.title}</td>
          <td>${badge(b.status, 'badge')}</td>
          <td style="font-size:11px;color:var(--text-muted)">${b.sprint_name || '—'}</td>
          <td style="font-size:11px;color:var(--text-muted)">${(b.files||[]).length}</td>
          <td>${completenessBar(b.completeness)}</td>
        </tr>
        <tr class="detail-row"><td colspan="8"><div class="detail-content" id="detail-${b.id}">
          <p style="margin-bottom:6px;color:var(--text-secondary)">${b.notes || ''}</p>
          ${b.files?.length ? `<p style="margin-bottom:6px"><strong>Files:</strong> <code>${b.files.join(', ')}</code></p>` : ''}
          ${renderArtifacts(b.artifact_refs)}
          ${b.debt_reasons?.length ? `<div style="margin-top:8px"><strong>Debt:</strong> <div class="debt-reasons">${b.debt_reasons.map(r => `<span class="debt-reason-tag">${r}</span>`).join('')}</div></div>` : ''}
        </div></td></tr>
      `).join('')}</tbody>
    </table>`;
  }

  function renderCRTable(items) {
    if (!items.length) return '<div class="no-data">No CRs match filters.</div>';
    return `<table class="data-table">
      <thead><tr>
        <th></th><th>ID</th><th>Phase</th><th>Title</th><th>Status</th><th>Sprint</th><th>Files</th><th>Artifacts</th>
      </tr></thead>
      <tbody>${items.map(c => `
        <tr class="expandable" onclick="toggleRow('${c.id}')">
          <td><span class="expand-icon" id="icon-${c.id}">&#9654;</span></td>
          <td style="font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c.id}</td>
          <td style="font-size:11px;color:var(--text-muted)">${c.phase || '—'}</td>
          <td>${c.title}</td>
          <td>${badge(c.status, 'badge')}</td>
          <td style="font-size:11px;color:var(--text-muted)">${c.sprint_name || '—'}</td>
          <td style="font-size:11px;color:var(--text-muted)">${(c.files||[]).length}</td>
          <td>${completenessBar(c.completeness)}</td>
        </tr>
        <tr class="detail-row"><td colspan="8"><div class="detail-content" id="detail-${c.id}">
          <p style="margin-bottom:6px;color:var(--text-secondary)">${c.notes || ''}</p>
          ${c.files?.length ? `<p style="margin-bottom:6px"><strong>Files:</strong> <code>${c.files.join(', ')}</code></p>` : ''}
          ${renderArtifacts(c.artifact_refs)}
          ${c.debt_reasons?.length ? `<div style="margin-top:8px"><strong>Debt:</strong> <div class="debt-reasons">${c.debt_reasons.map(r => `<span class="debt-reason-tag">${r}</span>`).join('')}</div></div>` : ''}
        </div></td></tr>
      `).join('')}</tbody>
    </table>`;
  }

  // ── Filtering ───────────────────────────────────────────────
  function filterItems(items) {
    const search = searchInput.value.toLowerCase();
    const sprint = sprintFilter.value;
    const severity = severityFilter.value;
    const status = statusFilter.value;

    return items.filter(item => {
      if (sprint === '__unassigned__' && item.sprint_key) return false;
      if (sprint && sprint !== '__unassigned__' && item.sprint_key !== sprint) return false;
      if (severity && item.severity !== severity) return false;
      if (status && item.status !== status) return false;
      if (search) {
        const haystack = [
          item.id, item.title, item.notes,
          ...(item.files || []), item.phase,
          item.sprint_name, item.status, item.severity
        ].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }

  function applyFilters() {
    document.getElementById('tab-debt').innerHTML = renderDebtTable(filterItems(debt));
    document.getElementById('tab-bugs').innerHTML = renderBugTable(filterItems(bugs));
    document.getElementById('tab-crs').innerHTML = renderCRTable(filterItems(crs));
  }

  // Wire up filters
  searchInput.addEventListener('input', applyFilters);
  sprintFilter.addEventListener('change', applyFilters);
  severityFilter.addEventListener('change', applyFilters);
  statusFilter.addEventListener('change', applyFilters);

  // ── CSV Export ──────────────────────────────────────────────
  document.getElementById('csv-export-btn').addEventListener('click', () => {
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    let data, filename;
    if (activeTab === 'crs') { data = filterItems(crs); filename = 'crs.csv'; }
    else if (activeTab === 'bugs') { data = filterItems(bugs); filename = 'bugs.csv'; }
    else { data = filterItems(debt); filename = 'debt.csv'; }

    if (!data.length) return;
    const headers = Object.keys(data[0]).filter(k => k !== 'artifact_refs' && k !== 'completeness');
    const rows = data.map(item =>
      headers.map(h => {
        let val = item[h];
        if (Array.isArray(val)) val = val.join('; ');
        if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
        return `"${String(val || '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  });

  // ── Initial render ──────────────────────────────────────────
  applyFilters();

})();
