const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const clients = new Set();

const ranks = [
  'General', 'Generalleutnant', 'Generalmajor', 'Brigadegeneral',
  'Oberst', 'Oberstleutnant', 'Major', 'Hauptmann', 'Oberleutnant', 'Leutnant',
  'Stabsfeldwebel', 'Oberstabsfeldwebel', 'Hauptfeldwebel', 'Oberfeldwebel', 'Feldwebel',
  'Stabsunteroffizier', 'Unteroffizier', 'Oberstabsgefreiter', 'Stabsgefreiter',
  'Hauptgefreiter', 'Obergefreiter', 'Gefreiter', 'Schütze / Matrose / Flieger'
];

function now() { return new Date().toISOString(); }
function id(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }

const initialState = {
  meta: { operation: 'OPERATION EISENWACHTE', phase: 'PLANUNG', status: 'Vorbereitung', createdAt: now() },
  personnel: [
    { id: 'p-01', callsign: 'ALPHA 1-1', name: 'Max Mustermann', rank: 'Hauptmann', role: 'Zugführer', unit: '1. Zug', ready: true, active: true },
    { id: 'p-02', callsign: 'ALPHA 1-2', name: 'Alex Berger', rank: 'Feldwebel', role: 'Gruppenführer', unit: '1. Gruppe', ready: true, active: true },
    { id: 'p-03', callsign: 'ALPHA 1-3', name: 'Jonas Weber', rank: 'Obergefreiter', role: 'Schütze', unit: '1. Gruppe', ready: false, active: true }
  ],
  units: [
    { id: 'u-01', name: '1. Zug', type: 'Zug', parent: 'Kampfkompanie', commander: 'p-01', readiness: 82, status: 'Bereitstellung' },
    { id: 'u-02', name: '1. Gruppe', type: 'Gruppe', parent: '1. Zug', commander: 'p-02', readiness: 100, status: 'Bereit' },
    { id: 'u-03', name: 'Sanitätstrupp', type: 'Unterstützung', parent: 'Kampfkompanie', commander: null, readiness: 65, status: 'Verfügbar' }
  ],
  tasks: [
    { id: 't-01', title: 'Marschkorridor sichern', unit: '1. Zug', priority: 'HOCH', status: 'OFFEN', due: '21:30' },
    { id: 't-02', title: 'OBJ ALPHA aufklären', unit: '1. Gruppe', priority: 'MITTEL', status: 'OFFEN', due: '22:00' },
    { id: 't-03', title: 'Sanitätsstation vorbereiten', unit: 'Sanitätstrupp', priority: 'HOCH', status: 'IN ARBEIT', due: '21:45' }
  ],
  markers: [
    { id: 'm-01', x: 35, y: 38, label: 'OBJ ALPHA', type: 'objective' },
    { id: 'm-02', x: 67, y: 56, label: 'RP NORTH', type: 'rally' },
    { id: 'm-03', x: 52, y: 74, label: 'MED', type: 'medical' }
  ],
  reports: [
    { id: 'r-01', time: now(), author: 'ALPHA 1-2', type: 'LAGEMELDUNG', text: 'Bereitstellung vollständig, keine besonderen Vorkommnisse.' }
  ],
  aar: { summary: '', successes: '', failures: '', lessons: '', actions: [] },
  audit: []
};

function ensureState() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STATE_FILE)) fs.writeFileSync(STATE_FILE, JSON.stringify(initialState, null, 2));
}
function loadState() {
  ensureState();
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return structuredClone(initialState); }
}
let state = loadState();
function saveState() { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); }
function addAudit(action, actor, detail) {
  state.audit.unshift({ id: id('a'), time: now(), action, actor: actor || 'SYSTEM', detail });
  state.audit = state.audit.slice(0, 100);
}
function broadcast(event) {
  const payload = `event: ${event.type}\ndata: ${JSON.stringify({ event, state })}\n\n`;
  for (const res of clients) res.write(payload);
}
function mutate(eventType, actor, detail, fn) {
  fn();
  addAudit(eventType, actor, detail);
  saveState();
  broadcast({ type: eventType, actor, detail, at: now() });
}
function send(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(data));
}
function serveStatic(res, pathname) {
  let file = pathname === '/' ? '/index.html' : pathname;
  const full = path.normalize(path.join(ROOT, file));
  if (!full.startsWith(ROOT) || full.includes(`${path.sep}data${path.sep}`)) return send(res, 403, { error: 'Forbidden' });
  fs.readFile(full, (err, buf) => {
    if (err) return send(res, 404, { error: 'Not found' });
    const ext = path.extname(full);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.ico': 'image/x-icon', '.svg': 'image/svg+xml' };
    res.writeHead(200, { 'Content-Type': `${types[ext] || 'application/octet-stream'}; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(buf);
  });
}
function body(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 2e6) req.destroy(); });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  try {
    if (req.method === 'GET' && pathname === '/api/state') return send(res, 200, state);
    if (req.method === 'GET' && pathname === '/api/ranks') return send(res, 200, ranks);
    if (req.method === 'GET' && pathname === '/api/events') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' });
      res.write(`event: connected\ndata: ${JSON.stringify({ state })}\n\n`);
      clients.add(res);
      const timer = setInterval(() => res.write(': keepalive\n\n'), 15000);
      req.on('close', () => { clearInterval(timer); clients.delete(res); });
      return;
    }
    if (req.method === 'POST' && pathname === '/api/personnel') {
      const b = await body(req);
      if (!b.name) return send(res, 400, { error: 'name required' });
      mutate('PERSONNEL_UPDATED', b.actor || b.name, `Personal angelegt: ${b.name}`, () => state.personnel.push({ id: id('p'), callsign: b.callsign || 'UNASSIGNED', name: b.name, rank: b.rank || ranks.at(-1), role: b.role || 'Schütze', unit: b.unit || '1. Gruppe', ready: false, active: true }));
      return send(res, 201, state.personnel.at(-1));
    }
    if (req.method === 'PATCH' && pathname.startsWith('/api/personnel/')) {
      const pid = pathname.split('/').pop(); const b = await body(req); const p = state.personnel.find(x => x.id === pid);
      if (!p) return send(res, 404, { error: 'not found' });
      mutate('PERSONNEL_UPDATED', b.actor || p.name, `Personal geändert: ${p.name}`, () => Object.assign(p, b.changes || {}));
      return send(res, 200, p);
    }
    if (req.method === 'POST' && pathname === '/api/tasks') {
      const b = await body(req); if (!b.title) return send(res, 400, { error: 'title required' });
      const task = { id: id('t'), title: b.title, unit: b.unit || '1. Zug', priority: b.priority || 'MITTEL', status: 'OFFEN', due: b.due || '--:--' };
      mutate('TASK_CREATED', b.actor || 'SYSTEM', `Auftrag erstellt: ${task.title}`, () => state.tasks.push(task)); return send(res, 201, task);
    }
    if (req.method === 'PATCH' && pathname.startsWith('/api/tasks/')) {
      const tid = pathname.split('/').pop(); const b = await body(req); const task = state.tasks.find(x => x.id === tid);
      if (!task) return send(res, 404, { error: 'not found' });
      mutate('TASK_UPDATED', b.actor || 'SYSTEM', `Auftrag geändert: ${task.title}`, () => Object.assign(task, b.changes || {})); return send(res, 200, task);
    }
    if (req.method === 'POST' && pathname === '/api/reports') {
      const b = await body(req); if (!b.text) return send(res, 400, { error: 'text required' });
      const report = { id: id('r'), time: now(), author: b.author || 'UNKNOWN', type: b.type || 'LAGEMELDUNG', text: b.text };
      mutate('REPORT_CREATED', report.author, `Meldung: ${report.text}`, () => state.reports.unshift(report)); return send(res, 201, report);
    }
    if (req.method === 'POST' && pathname === '/api/markers') {
      const b = await body(req);
      const marker = { id: id('m'), x: Math.min(96, Math.max(4, Number(b.x) || 50)), y: Math.min(92, Math.max(4, Number(b.y) || 50)), label: b.label || 'MARKER', type: b.type || 'default' };
      mutate('MARKER_CREATED', b.actor || 'SYSTEM', `Marker gesetzt: ${marker.label}`, () => state.markers.push(marker)); return send(res, 201, marker);
    }
    if (req.method === 'PATCH' && pathname.startsWith('/api/markers/')) {
      const mid = pathname.split('/').pop(); const b = await body(req); const marker = state.markers.find(x => x.id === mid);
      if (!marker) return send(res, 404, { error: 'not found' });
      mutate('MARKER_UPDATED', b.actor || 'SYSTEM', `Marker geändert: ${marker.label}`, () => Object.assign(marker, b.changes || {})); return send(res, 200, marker);
    }
    if (req.method === 'PATCH' && pathname === '/api/operation') {
      const b = await body(req);
      mutate('OPERATION_UPDATED', b.actor || 'SYSTEM', 'Operationsstatus geändert', () => Object.assign(state.meta, b.changes || {})); return send(res, 200, state.meta);
    }
    if (req.method === 'PATCH' && pathname === '/api/aar') {
      const b = await body(req);
      mutate('AAR_UPDATED', b.actor || 'SYSTEM', 'AAR aktualisiert', () => Object.assign(state.aar, b.changes || {})); return send(res, 200, state.aar);
    }
    return serveStatic(res, pathname);
  } catch (e) { return send(res, 500, { error: e.message }); }
});

server.listen(PORT, HOST, () => {
  const nets = Object.values(os.networkInterfaces()).flat().filter(x => x && x.family === 'IPv4' && !x.internal).map(x => x.address);
  console.log(`BWMilsim läuft auf http://localhost:${PORT}`);
  nets.forEach(ip => console.log(`LAN: http://${ip}:${PORT}`));
});

process.on('SIGINT', () => { for (const res of clients) res.end(); server.close(() => process.exit(0)); });
