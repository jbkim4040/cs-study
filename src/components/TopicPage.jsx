import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import Quiz from './Quiz.jsx'
import RichText from './RichText.jsx'
import { TOPIC_BY_ID, SUBJECTS, QUIZZES } from '../data/subjects.js'
import { buildGlossary } from '../lib/glossary.js'

import NetLayerMap from './NetLayerMap.jsx'

// 시각화는 코드 분할 — 주제를 열 때 해당 시각화 청크만 동적 로드
const VIZ = {
  pointer: lazy(() => import('./viz/PointerViz.jsx')),
  list: lazy(() => import('./viz/ListViz.jsx')),
  array: lazy(() => import('./viz/ArrayViz.jsx')),
  stack: lazy(() => import('./viz/StackViz.jsx')),
  queue: lazy(() => import('./viz/QueueViz.jsx')),
  linkedlist: lazy(() => import('./viz/LinkedListViz.jsx')),
  circular: lazy(() => import('./viz/CircularViz.jsx')),
  tree: lazy(() => import('./viz/TreeViz.jsx')),
  bst: lazy(() => import('./viz/BSTViz.jsx')),
  priorityqueue: lazy(() => import('./viz/PriorityQueueViz.jsx')),
  hashtable: lazy(() => import('./viz/HashViz.jsx')),
  graph: lazy(() => import('./viz/GraphViz.jsx')),
  weightedgraph: lazy(() => import('./viz/WeightedGraphViz.jsx')),
  sorting: lazy(() => import('./viz/SortingViz.jsx')),
  process: lazy(() => import('./viz/ProcessViz.jsx')),
  thread: lazy(() => import('./viz/ThreadViz.jsx')),
  scheduling: lazy(() => import('./viz/SchedulingViz.jsx')),
  sync: lazy(() => import('./viz/SyncViz.jsx')),
  ipc: lazy(() => import('./viz/IPCViz.jsx')),
  deadlock: lazy(() => import('./viz/DeadlockViz.jsx')),
  memory: lazy(() => import('./viz/MemoryViz.jsx')),
  paging: lazy(() => import('./viz/PagingViz.jsx')),
  segmentation: lazy(() => import('./viz/SegmentationViz.jsx')),
  virtualmemory: lazy(() => import('./viz/VirtualMemoryViz.jsx')),
  pagereplace: lazy(() => import('./viz/PageReplaceViz.jsx')),
  filesystem: lazy(() => import('./viz/FileSystemViz.jsx')),
  diskscheduling: lazy(() => import('./viz/DiskSchedulingViz.jsx')),
  icmp: lazy(() => import('./viz/ICMPViz.jsx')),
  transport: lazy(() => import('./viz/TransportViz.jsx')),
  udp: lazy(() => import('./viz/UDPViz.jsx')),
  tcp: lazy(() => import('./viz/TCPViz.jsx')),
  application: lazy(() => import('./viz/ApplicationViz.jsx')),
}

const CODE_LABEL = { python: '🐍 Python', javascript: '🟡 JavaScript', pseudo: '📋 의사코드', c: '🔧 C' }

export default function TopicPage({ id, markVisited, recordScore, glossaryOn, onSelect }) {
  const topic = TOPIC_BY_ID[id]
  const questions = QUIZZES[id] || []
  const Viz = VIZ[id]
  const subj = SUBJECTS.find(s => s.id === topic.subject)
  const cat = subj && subj.categories.find(c => c.id === topic.category)

  const codeLangs = Object.keys(topic.code || {})
  const [codeLang, setCodeLang] = useState(codeLangs[0])
  const [copied, setCopied] = useState(false)
  const [activeSec, setActiveSec] = useState('concept')

  const glossary = useMemo(
    () => (glossaryOn ? buildGlossary(topic.terminology) : null),
    [glossaryOn, id] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => { markVisited?.(id) }, [id, markVisited])

  const sections = [
    { key: 'concept', label: '개념', icon: '💡' },
    topic.classification && { key: 'class', label: '분류', icon: '🗂' },
    topic.terminology && { key: 'term', label: '용어', icon: '📖' },
    topic.mechanism && { key: 'mech', label: '동작 원리', icon: '⚡' },
    topic.adt && { key: 'adt', label: 'ADT', icon: '🔧' },
    topic.complexity && { key: 'complexity', label: '복잡도', icon: '⏱' },
    topic.comparison && { key: 'compare', label: '비교', icon: '⚖️' },
    topic.representation && { key: 'repr', label: '표현', icon: '🏗' },
    topic.properties && { key: 'props', label: '특징', icon: '📐' },
    { key: 'viz', label: '시각화', icon: '🎮' },
    { key: 'code', label: '코드', icon: '💻' },
    { key: 'use', label: '활용', icon: '🚀' },
    questions.length > 0 && { key: 'quiz', label: '퀴즈', icon: '✏️' },
  ].filter(Boolean)

  useEffect(() => {
    const els = sections.map(s => document.getElementById('sec-' + s.key)).filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(
      entries => {
        const vis = entries.filter(e => e.isIntersecting)
        if (!vis.length) return
        vis.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        setActiveSec(vis[0].target.id.replace('sec-', ''))
      },
      { rootMargin: '-72px 0px -68% 0px', threshold: 0 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  function scrollToSec(key) {
    const el = document.getElementById('sec-' + key)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function copyCode() {
    navigator.clipboard.writeText(topic.code[codeLang]).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="ds-page" style={{ '--color': topic.color }}>
      <header className="ds-hero" style={{ '--color': topic.color }}>
        <span className="ds-hero-emoji">{topic.emoji}</span>
        <div className="ds-hero-text">
          {cat && <span className="ds-hero-cat">{subj.label} · {cat.label}</span>}
          <div className="ds-hero-titles">
            <h1 className="ds-hero-title">{topic.name}</h1>
            <span className="ds-hero-sub">{topic.subtitle}</span>
          </div>
          <p className="ds-hero-tagline">{topic.tagline}</p>
        </div>
      </header>

      {topic.subject === 'net' && (
        <NetLayerMap category={topic.category} color={topic.color} onSelect={onSelect} />
      )}

      <nav className="ds-toc">
        {sections.map(s => (
          <button
            key={s.key}
            className={'toc-chip' + (activeSec === s.key ? ' active' : '')}
            onClick={() => scrollToSec(s.key)}
          >
            <span className="toc-icon">{s.icon}</span>{s.label}
          </button>
        ))}
      </nav>

      {/* 개념 */}
      <section className="section" id="sec-concept">
        <h2 className="section-title">💡 개념</h2>
        <div className="concept-cards">
          {topic.concept.map((c, i) => (
            <div key={i} className="concept-card">
              <span className="concept-num" style={{ background: topic.color + '22', color: topic.color }}>{i + 1}</span>
              <p><RichText text={c} glossary={glossary} /></p>
            </div>
          ))}
        </div>
        <div className="key-points">
          {topic.keyPoints.map((kp, i) => (
            <span key={i} className="kp-chip"><RichText text={kp} glossary={glossary} /></span>
          ))}
        </div>
      </section>

      {/* 분류 */}
      {topic.classification && (
        <section className="section" id="sec-class">
          <h2 className="section-title">🗂 분류</h2>
          <div className="class-grid">
            {topic.classification.map((c, i) => (
              <div key={i} className="class-card" style={{ '--color': topic.color }}>
                <div className="class-name">{c.name}</div>
                <div className="class-desc"><RichText text={c.desc} glossary={glossary} /></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 용어 */}
      {topic.terminology && (
        <section className="section" id="sec-term">
          <h2 className="section-title">📖 용어 정리</h2>
          <div className="term-list">
            {topic.terminology.map((t, i) => (
              <div key={i} className="term-row">
                <span className="term-word" style={{ color: topic.color }}>{t.term}</span>
                <span className="term-def">{t.def}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 동작 원리 */}
      {topic.mechanism && (
        <section className="section" id="sec-mech">
          <h2 className="section-title">⚡ 동작 원리</h2>
          <p className="adt-desc">{topic.mechanism.description}</p>
          <div className="concept-cards">
            {topic.mechanism.steps.map((s, i) => (
              <div key={i} className="concept-card">
                <span className="concept-num" style={{ background: topic.color + '22', color: topic.color }}>{i + 1}</span>
                <p><strong>{s.title}</strong> — <RichText text={s.desc} glossary={glossary} /></p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ADT */}
      {topic.adt && (
        <section className="section" id="sec-adt">
          <h2 className="section-title">🔧 ADT (추상 자료형)</h2>
          <p className="adt-desc">{topic.adt.description}</p>
          <div className="table-wrap">
            <table className="complexity-table adt-table">
              <thead><tr><th>연산 시그니처</th><th>설명</th><th>복잡도</th></tr></thead>
              <tbody>
                {topic.adt.operations.map((op, i) => (
                  <tr key={i}>
                    <td><code className="sig">{op.sig}</code></td>
                    <td className="note-cell">{op.desc}</td>
                    <td>{op.complexity && <span className="badge" style={{ '--color': topic.color }}>{op.complexity}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 시간 복잡도 */}
      {topic.complexity && (
        <section className="section" id="sec-complexity">
          <h2 className="section-title">⏱ 시간 복잡도</h2>
          <div className="table-wrap">
            <table className="complexity-table">
              <thead><tr><th>연산</th><th>평균</th><th>최악</th><th>설명</th></tr></thead>
              <tbody>
                {topic.complexity.map((row, i) => (
                  <tr key={i}>
                    <td className="op-name">{row.op}</td>
                    <td><span className="badge" style={{ '--color': topic.color }}>{row.avg}</span></td>
                    <td><span className="badge worst">{row.worst}</span></td>
                    <td className="note-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 비교 */}
      {topic.comparison && (
        <section className="section" id="sec-compare">
          <h2 className="section-title">⚖️ {topic.comparison.title}</h2>
          <div className="table-wrap">
            <table className="complexity-table">
              <thead>
                <tr>{topic.comparison.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {topic.comparison.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      j === 0
                        ? <td key={j} className="op-name">{cell}</td>
                        : <td key={j} className="note-cell">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 표현 방법 */}
      {topic.representation && (
        <section className="section" id="sec-repr">
          <h2 className="section-title">🏗 표현 방법</h2>
          <div className="repr-grid">
            {topic.representation.map((r, i) => (
              <div key={i} className="repr-card" style={{ '--color': topic.color }}>
                <div className="repr-title">{r.title}</div>
                <div className="repr-desc">{r.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 특징 */}
      {topic.properties && (
        <section className="section" id="sec-props">
          <h2 className="section-title">📐 특징</h2>
          <ul className="prop-list">
            {topic.properties.map((p, i) => (
              <li key={i} className="prop-item">
                <span className="prop-dot" style={{ background: topic.color }} />
                <RichText text={p} glossary={glossary} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 시각화 */}
      <section className="section" id="sec-viz">
        <h2 className="section-title">🎮 직접 해보기</h2>
        <div className="viz-container" style={{ '--color': topic.color }}>
          {Viz && (
            <Suspense fallback={<div className="viz-loading">시각화를 불러오는 중…</div>}>
              <Viz color={topic.color} />
            </Suspense>
          )}
        </div>
      </section>

      {/* 코드 */}
      <section className="section" id="sec-code">
        <h2 className="section-title">💻 코드</h2>
        <div className="code-block">
          <div className="code-header">
            <div className="lang-tabs">
              {codeLangs.map(lang => (
                <button key={lang} className={'lang-tab' + (codeLang === lang ? ' active' : '')} onClick={() => setCodeLang(lang)}>
                  {CODE_LABEL[lang] || lang}
                </button>
              ))}
            </div>
            <button className="copy-btn" onClick={copyCode}>{copied ? '✓ 복사됨' : '복사'}</button>
          </div>
          <pre className="code-pre"><code>{topic.code[codeLang]}</code></pre>
        </div>
      </section>

      {/* 활용 */}
      <section className="section" id="sec-use">
        <h2 className="section-title">🚀 실제 활용</h2>
        <div className="use-cases">
          {topic.useCases.map((u, i) => <span key={i} className="use-chip">{u}</span>)}
        </div>
      </section>

      {/* 퀴즈 */}
      {questions.length > 0 && (
        <section className="section" id="sec-quiz">
          <h2 className="section-title">✏️ 퀴즈 ({questions.length}문제)</h2>
          <Quiz
            questions={questions}
            color={topic.color}
            onComplete={(score, total) => recordScore?.(id, Math.round((score / total) * 100))}
          />
        </section>
      )}
    </div>
  )
}
