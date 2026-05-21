import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopicPage from './components/TopicPage.jsx'
import FullQuiz from './components/FullQuiz.jsx'
import { SUBJECTS, TOPIC_BY_ID } from './data/subjects.js'
import { loadProgress, saveProgress } from './lib/progress.js'

export default function App() {
  const [subject, setSubject] = useState('ds')
  const [selected, setSelected] = useState(SUBJECTS[0].topics[0].id)
  const [fullQuiz, setFullQuiz] = useState(false)
  const [progress, setProgress] = useState(loadProgress)
  const [navOpen, setNavOpen] = useState(false)

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

  return (
    <div className="app-shell">
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
      <main className="main-area">
        {fullQuiz
          ? <FullQuiz subject={subject} onBack={() => setFullQuiz(false)} recordScore={recordScore} />
          : <TopicPage id={selected} key={selected} markVisited={markVisited} recordScore={recordScore} glossaryOn={progress.glossary} onSelect={selectTopic} />
        }
      </main>
    </div>
  )
}
