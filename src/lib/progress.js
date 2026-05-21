// 학습 진행률 + 환경설정 — localStorage 기반 (백엔드 없음)
const KEY = 'cs-study-progress-v1'

const EMPTY = { visited: [], scores: {}, glossary: true }

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const p = JSON.parse(raw)
    return {
      visited: Array.isArray(p.visited) ? p.visited : [],
      scores: p.scores && typeof p.scores === 'object' ? p.scores : {},
      glossary: p.glossary !== false, // 기본값 ON
    }
  } catch {
    return { ...EMPTY }
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* 사파리 프라이빗 모드 등 — 무시 */
  }
}
