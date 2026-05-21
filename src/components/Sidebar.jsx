import { useState } from 'react'
import { SUBJECTS, ALL_TOPICS } from '../data/subjects.js'

export default function Sidebar({
  subject, selected, onSelectSubject, onSelect, onFullQuiz, isFullQuiz,
  progress, glossaryOn, onToggleGlossary, open,
}) {
  const [query, setQuery] = useState('')
  const visited = new Set(progress.visited)
  const scores = progress.scores || {}
  const byId = Object.fromEntries(ALL_TOPICS.map(t => [t.id, t]))
  const activeSubject = SUBJECTS.find(s => s.id === subject)

  const q = query.trim().toLowerCase()
  const matches = t =>
    !q ||
    t.name.toLowerCase().includes(q) ||
    t.subtitle.toLowerCase().includes(q) ||
    t.id.includes(q)
  const searchResults = q ? ALL_TOPICS.filter(matches) : null

  const total = ALL_TOPICS.length
  const learned = ALL_TOPICS.filter(t => visited.has(t.id)).length
  const pct = Math.round((learned / total) * 100)

  function NavItem(t) {
    const done = visited.has(t.id)
    const score = scores[t.id]
    return (
      <button
        key={t.id}
        className={'nav-item' + (selected === t.id && !isFullQuiz ? ' active' : '')}
        style={{ '--accent': t.color }}
        onClick={() => onSelect(t.id)}
      >
        <span className="nav-emoji">{t.emoji}</span>
        <div className="nav-text">
          <span className="nav-name">{t.name}</span>
          <span className="nav-sub">{t.subtitle}</span>
        </div>
        {score != null
          ? <span className={'nav-score' + (score >= 60 ? ' pass' : '')}>{score}</span>
          : done && <span className="nav-check">✓</span>}
      </button>
    )
  }

  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <div className="sidebar-logo">
        <span className="logo-icon">🎓</span>
        <span className="logo-text">CS Study</span>
      </div>

      <div className="subject-tabs">
        {SUBJECTS.map(s => (
          <button
            key={s.id}
            className={'subject-tab' + (subject === s.id ? ' active' : '')}
            style={{ '--accent': s.accent }}
            onClick={() => onSelectSubject(s.id)}
          >
            <span className="st-icon">{s.icon}</span>
            <span>{s.tabLabel || s.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-progress">
        <div className="sp-row">
          <span>전체 학습 진행</span>
          <span className="sp-count">{learned} / {total}</span>
        </div>
        <div className="sp-bar">
          <div className="sp-fill" style={{ width: pct + '%' }} />
        </div>
      </div>

      <div className="sidebar-search">
        <input
          type="text"
          className="search-input"
          placeholder="전체 주제 검색…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <nav className="sidebar-nav">
        {searchResults ? (
          searchResults.length
            ? searchResults.map(NavItem)
            : <div className="nav-empty">검색 결과가 없습니다</div>
        ) : (
          activeSubject.categories.map(cat => {
            const items = cat.ids.map(id => byId[id]).filter(Boolean)
            if (!items.length) return null
            return (
              <div key={cat.id} className="nav-category">
                <div className="nav-label">{cat.label}</div>
                {items.map(NavItem)}
              </div>
            )
          })
        )}
      </nav>

      <div className="sidebar-footer">
        <button
          className={'glossary-toggle' + (glossaryOn ? ' on' : '')}
          onClick={onToggleGlossary}
          aria-pressed={glossaryOn}
        >
          <span>키워드 용어 풀이</span>
          <span className="gt-switch"><span className="gt-knob" /></span>
        </button>
        <button
          className={'full-quiz-btn' + (isFullQuiz ? ' active' : '')}
          onClick={onFullQuiz}
        >
          {activeSubject.label} 전체 퀴즈
          {scores['__full_' + subject] != null && (
            <span className="fq-score">최고 점수 {scores['__full_' + subject]}점</span>
          )}
        </button>
      </div>
    </aside>
  )
}
