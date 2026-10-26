export function localKey(d) { return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-') }
export function parseDay(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12) }
export function addDays(s, n) { const d = parseDay(s); d.setDate(d.getDate() + n); return localKey(d) }
export function dayDiff(a, b) { return Math.round((parseDay(b) - parseDay(a)) / 86400000) }
export function weekStart(s) { return addDays(s, -((parseDay(s).getDay() + 6) % 7)) }
export function monthStart(s) { return s.slice(0, 7) + '-01' }
export function shiftMonth(s, n) { const d = parseDay(s); d.setDate(1); d.setMonth(d.getMonth() + n); return localKey(d) }
export function formatDate(s, opt = { month: 'long', day: 'numeric' }) { return new Intl.DateTimeFormat('zh-CN', opt).format(parseDay(s)) }
export function validDay(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && localKey(parseDay(s)) === s }
export function dateLabel(s) { return formatDate(s, { month: 'numeric', day: 'numeric' }) }
export function activeOn(entry, date) { return entry.start <= date && entry.end >= date }
export function eventSort(a, b) { return dayDiff(b.start, b.end) - dayDiff(a.start, a.end) || a.start.localeCompare(b.start) || a.title.localeCompare(b.title) }
