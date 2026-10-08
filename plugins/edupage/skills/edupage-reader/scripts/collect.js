// EduPage fast path – runs inside the parent's signed-in EduPage tab via javascript_tool.
// Read-only: same-origin GET/POST requests the EduPage web itself makes, with the parent's cookies.
// No credentials, nothing is sent anywhere else. Returns a compact JSON summary for the CURRENT school.
// Usage: paste this whole file as the javascript_tool text. Adjust OPTIONS below if needed.
const OPTIONS = {
  daysAhead: 14,      // upcoming tests / homework / events window
  daysBack: 7,        // "new" messages, grades, announced tests window
  weekTimetable: true // also fetch the timetable for this and next week (else only today/tomorrow)
};

async function edupageCollect(opt) {
  const today = new Date(); const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); // local date
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const from = iso(addDays(today, -opt.daysBack)), to = iso(addDays(today, opt.daysAhead)), now = iso(today);
  const P = x => { if (typeof x !== 'string') return x || {}; try { return JSON.parse(x); } catch (e) { return {}; } };
  const grab = (html, marker) => {
    const k = html.indexOf(marker); if (k < 0) return null;
    const s = html.indexOf('{', k); let d = 0, j = s, inS = false, esc = false;
    for (; j < html.length; j++) {
      const c = html[j];
      if (inS) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inS = false; continue; }
      if (c === '"') inS = true; else if (c === '{') d++; else if (c === '}') { d--; if (d === 0) break; }
    }
    return JSON.parse(html.slice(s, j + 1));
  };
  const strip = (t, n) => (t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

  const userRes = await fetch('/user/', { credentials: 'include' });
  if (/\/login|signin/i.test(userRes.url)) return { error: 'signed_out' };
  const uh = grab(await userRes.text(), 'userhome(');
  if (!uh) return { error: 'no_userhome', hint: 'not signed in as parent, or EduPage changed – fall back to the UI' };

  const dbi = uh.dbi || {};
  const subj = id => (dbi.subjects && dbi.subjects[id] && dbi.subjects[id].name) || id || '';
  const subjShort = id => (dbi.subjects && dbi.subjects[id] && dbi.subjects[id].short) || '';
  const teacher = id => { const t = dbi.teachers && dbi.teachers[id]; return t ? `${t.firstname || ''} ${t.lastname || ''}`.trim() : ''; };
  const studentIds = (uh.parentStudentids || []).map(s => String(s).replace(/\D/g, ''));
  const child = id => { const s = dbi.students && dbi.students[id]; const cls = s && dbi.classes && dbi.classes[s.classid]; return { id, name: s ? `${s.firstname || ''} ${s.lastname || ''}`.trim() : '', class: cls ? cls.name : '' }; };

  const TEST = { exam: 'Písomka', bexam: 'Veľká písomka', sexam: 'Kratučký testík', testing: 'Skúšanie', oexam: 'Ústne skúšanie', rexam: 'Referát', pexam: 'Projekt' };
  const evTypeName = Object.fromEntries((uh.eventTypes || []).map(t => [t.id, t.name]));
  const items = (uh.items || []).filter(i => String(i.removed) !== '1');

  const tests = [], events = [], homework = [], messages = [], substitutions = [], lunches = [];
  for (const it of items) {
    const d = P(it.data);
    if (it.typ === 'event') {
      const date = d.dateto || (it.cas_udalosti || '').slice(0, 10);
      const row = { date, datefrom: d.datefrom, subject: subj(d.subjectid), title: strip(d.name, 200), period: d.period || null, announced: (it.cas_pridania || '').slice(0, 10), by: it.vlastnik_meno || '' };
      if (TEST[d.typ]) { if (date >= now && date <= to) tests.push({ ...row, type: TEST[d.typ], code: d.typ }); }
      else if (date >= now && date <= to) events.push({ ...row, type: evTypeName[d.typ] || d.typ, code: d.typ });
    } else if (it.typ === 'homework') {
      const due = d.date || (it.cas_udalosti || '').slice(0, 10);
      if (due >= from && due <= to) homework.push({ due, subject: subj(d.predmetid), title: strip(d.nazov || it.text, 160), details: strip(d.popis, 300), by: it.vlastnik_meno || '' });
    } else if (it.typ === 'sprava' || it.typ === 'news') {
      const added = (it.cas_pridania || '').slice(0, 10);
      if (added >= from) messages.push({ date: it.cas_pridania, from: it.vlastnik_meno || it.user_meno || '', reply: String(it.reakcia_na || '') !== '' && String(it.reakcia_na) !== '0', text: strip(it.text || d.title || (d.messageContent && d.messageContent.text), 600), attachments: !!(d.attachements && Object.keys(d.attachements).length) });
    } else if (it.typ === 'substitution') {
      substitutions.push({ dates: Object.keys(d).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k)), text: strip(it.text, 400) });
    } else if (it.typ === 'stravamenu' || it.typ === 'strava_vydaj') {
      const day = d.den || (it.cas_udalosti || '').slice(0, 10);
      if (day >= now && day <= iso(addDays(today, 2))) lunches.push({ date: day, text: strip(it.text, 300) });
    }
  }
  tests.sort((a, b) => a.date.localeCompare(b.date));
  events.sort((a, b) => a.date.localeCompare(b.date));
  homework.sort((a, b) => a.due.localeCompare(b.due));
  messages.sort((a, b) => b.date.localeCompare(a.date));

  // Timetable today/tomorrow from the home page data
  const lesson = p => ({ start: p.starttime, end: p.endtime, period: p.uniperiod || p.period, subject: subj(p.subjectid), short: subjShort(p.subjectid), teacher: (p.teacherids || []).map(teacher).join(', '), type: p.type, changed: !!p.type && p.type !== 'lesson' && p.type !== 'card' });
  const days = {};
  for (const [date, day] of Object.entries((uh.dp && uh.dp.dates) || {})) days[date] = (day.plan || []).filter(p => p.subjectid || p.type === 'event').map(lesson);

  // Week timetable (this + next week) – same request the "My timetable" page makes.
  // For today/tomorrow prefer today_tomorrow above (it already reflects substitutions); use week for other days.
  let week = null;
  if (opt.weekTimetable && studentIds[0] && window.ASC && ASC.gsechash) {
    const monday = addDays(today, -((today.getDay() + 6) % 7));
    try {
      const r = await fetch('/timetable/server/currenttt.js?__func=curentttGetData', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ __args: [null, { year: (uh.dp && uh.dp.year) || today.getFullYear(), datefrom: iso(monday), dateto: iso(addDays(monday, 13)), table: 'students', id: studentIds[0], showColors: true, showIgroupsInClasses: false, showOrig: true, log_module: 'CurrentTTView' }], __gsh: ASC.gsechash }) }).then(r => r.json());
      if (r.r && r.r.ttitems) {
        week = {};
        for (const t of r.r.ttitems) { (week[t.date] = week[t.date] || []).push({ start: t.starttime, end: t.endtime, period: t.uniperiod, subject: subj(t.subjectid), short: subjShort(t.subjectid), type: t.type, removed: !!t.removed, changed: !!(t.changed || t.substitution) }); }
        for (const k of Object.keys(week)) week[k].sort((a, b) => (a.start || '').localeCompare(b.start || ''));
      } else week = { error: r.r && r.r.error };
    } catch (e) { week = { error: String(e) }; }
  }

  // Grades (only the recent ones) from the grades page
  let grades = null;
  try {
    const zn = grab(await fetch('/znamky/', { credentials: 'include' }).then(r => r.text()), '.znamkyStudentViewer(');
    if (zn) {
      const ud = (zn.vsetkyUdalosti && (zn.vsetkyUdalosti.edupage || Object.values(zn.vsetkyUdalosti)[0])) || {};
      grades = (zn.vsetkyZnamky || []).filter(g => (g.datum || g.timestamp || '').slice(0, 10) >= from).map(g => ({ date: (g.datum || g.timestamp || '').slice(0, 10), subject: (zn.predmety && zn.predmety[g.predmetid] && zn.predmety[g.predmetid].p_meno) || subj(g.predmetid), value: g.data, what: strip(ud[g.udalostid] && ud[g.udalostid].p_meno, 120) })).sort((a, b) => b.date.localeCompare(a.date));
    }
  } catch (e) { grades = { error: String(e) }; }

  return { school: location.hostname.split('.')[0], schoolName: document.title, children: studentIds.map(child), period: { from, now, to }, tests, homework, events, messages, substitutions, lunches, today_tomorrow: days, week, grades,
    bells: (uh.zvonenia || []).map(z => `${z.name} ${z.starttime}-${z.endtime}`) };
}

await edupageCollect(OPTIONS);
