import { reactive } from 'vue'
import { validDay } from './date.js'

export const STORAGE = 'time.local.v1'
export const MOOD_COLORS = ['#FFD54A', '#73D6E8', '#78DDAF', '#BDA7FA', '#FFA5C5']
export const ENTRY_COLORS = ['#21A889', '#3D71ED', '#FF985C', '#A879E5', '#E887AD']
export const STATUS_LABELS = { todo: '未开始', doing: '进行中', paused: '暂停', done: '已完成' }
export const DEFAULT_MOOD = '#73D6E8'
export const blank = () => ({ version: 1, moods: {}, entries: [] })
const safeColor = s => typeof s === 'string' && /^#[0-9a-fA-F]{6}$/.test(s) ? s : DEFAULT_MOOD
export const newId = () => typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'time-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2)

export function normalize(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.entries) || !raw.moods || typeof raw.moods !== 'object' || Array.isArray(raw.moods)) throw Error('文件格式不正确')
  const clean = blank()
  for (const [key, mood] of Object.entries(raw.moods)) {
    if (validDay(key) && mood && typeof mood === 'object') clean.moods[key] = { text: String(mood.text || '').slice(0, 60), color: safeColor(mood.color) }
  }
  clean.entries = raw.entries.map(entry => {
    if (!entry || !['task', 'note'].includes(entry.kind) || !validDay(entry.start) || !validDay(entry.end) || entry.end < entry.start || typeof entry.title !== 'string' || !entry.title.trim()) throw Error('事项数据不正确')
    const status = entry.kind === 'task' ? (Object.hasOwn(STATUS_LABELS, entry.status) ? entry.status : entry.done ? 'done' : 'todo') : null
    return { id: String(entry.id || newId()), kind: entry.kind, title: entry.title.slice(0, 100), detail: String(entry.detail || '').slice(0, 1000), start: entry.start, end: entry.end, color: safeColor(entry.color), status, done: status === 'done' }
  })
  return clean
}

export function createStore(notify) {
  let initial = blank()
  try { const raw = localStorage.getItem(STORAGE); if (raw) initial = normalize(JSON.parse(raw)) } catch { /* Keep the page usable when stored data is invalid. */ }
  const state = reactive(initial)
  function persist() {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); return true }
    catch { notify('浏览器无法保存数据，请及时导出备份'); return false }
  }
  function replace(incoming) { state.version = incoming.version; state.moods = incoming.moods; state.entries = incoming.entries; persist() }
  return { state, persist, replace }
}
