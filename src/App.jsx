import { useState, useCallback, useRef } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopicPage from './components/TopicPage.jsx'
import FullQuiz from './components/FullQuiz.jsx'
import { SUBJECTS, TOPIC_BY_ID } from './data/subjects.js'
import { loadProgress, saveProgress } from './lib/progress.js'

const MIN_W = 190, MAX_W = 460

export default function App() {
  const [subject, setSubject] = useState('ds')
  const [selected, setSelected] = useState(SUBJECTS[0].topics[0].id)
  const [fullQuiz, setFullQuiz] = useState(false)
  const [progress, setProgress] = useState(loadProgress)
  const [navOpen, setNavOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const v = Number(localStorage.getItem('cs-sidebar-w'))
    return v >= MIN_W && v <= MAX_W ? v : 240
  })
  const widthRef = useRef(sidebarWidth)

  const markVisited = useCallback(id => {
    setProgress(prev => {
      if (prev.visited.includes(id)) return prev
      const next = { ...prev, visited: [...prev.visited, id] }
      saveProgress(next)
      return next
    })
  }, [])

  const recordScore = useCallback((id, pct) => {
    setProgress(prev => {
      const best = prev.scores[id]
      if (best != null && best >= pct) return prev
      const next = { ...prev, scores: { ...prev.scores, [id]: pct } }
      saveProgress(next)
      return next
    })
  }, [])

  const toggleGlossary = useCallback(() => {
    setProgress(prev => {
      const next = { ...prev, glossary: !prev.glossary }
      saveProgress(next)
      return next
    })
  }, [])

  function selectTopic(id) {
    setSelected(id)
    const t = TOPIC_BY_ID[id]
    if (t && t.subject !== subject) setSubject(t.subject)
    setFullQuiz(false)
    setNavOpen(false)
  }

  function selectSubject(sid) {
    if (sid === subject) return
    setSubject(sid)
    const subj = SUBJECTS.find(s => s.id === sid)
    setSelected(subj.topics[0].id)
    setFullQuiz(false)
  }

  function openFullQuiz() {
    setFullQuiz(true)
    setNavOpen(false)
  }

  // 사이드바 너비 드래그 조절
  function startResize(e) {
    e.preventDefault()
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    const onMove = ev => {
      const w = Math.min(MAX_W, Math.max(MIN_W, ev.clientX))
      widthRef.current = w
      setSidebarWidth(w)
    }
    const onUp = () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      localStorage.setItem('cs-sidebar-w', String(widthRef.current))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div className="app-shell" style={{ '--sidebar-w': sidebarWidth + 'px' }}>
      <button
        className="nav-toggle"
        onClick={() => setNavOpen(o => !o)}
        aria-label={navOpen ? '메뉴 닫기' : '메뉴 열기'}
      >
        {navOpen ? '✕' : '☰'}
      </button>
      <div
        className={'nav-overlay' + (navOpen ? ' show' : '')}
        onClick={() => setNavOpen(false)}
      />
      <Sidebar
        subject={subject}
        selected={selected}
        onSelectSubject={selectSubject}
        onSelect={selectTopic}
        onFullQuiz={openFullQuiz}
        isFullQuiz={fullQuiz}
        progress={progress}
        glossaryOn={progress.glossary}
        onToggleGlossary={toggleGlossary}
        open={navOpen}
      />
      <div
        className="sidebar-resizer"
        onMouseDown={startResize}
        onDoubleClick={() => { widthRef.current = 240; setSidebarWidth(240); localStorage.setItem('cs-sidebar-w', '240') }}
        role="separator"
        aria-orientation="vertical"
        aria-label="사이드바 너비 조절 (더블클릭 시 기본값)"
        title="드래그하여 너비 조절 · 더블클릭 시 기본값"
      />
      <main className="main-area">
        {fullQuiz
          ? <FullQuiz subject={subject} onBack={() => setFullQuiz(false)} recordScore={recordScore} />
          : <TopicPage id={selected} key={selected} markVisited={markVisited} recordScore={recordScore} glossaryOn={progress.glossary} onSelect={selectTopic} />
        }
      </main>
    </div>
  )
}
