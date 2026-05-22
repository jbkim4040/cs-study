import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react'
import Quiz from './Quiz.jsx'
import RichText from './RichText.jsx'
import { TOPIC_BY_ID, SUBJECTS, QUIZZES } from '../data/subjects.js'
import { buildGlossary } from '../lib/glossary.js'
import NetLayerMap from './NetLayerMap.jsx'
import ADTDiagram from './ADTDiagram.jsx'
import CodePlayground from './CodePlayground.jsx'

// 시각화는 코드 분할 — 해당 탭을 열 때만 청크를 동적 로드
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
  flowcontrol: lazy(() => import('./viz/FlowControlViz.jsx')),
  jvarray: lazy(() => import('./viz/ArrayMemViz.jsx')),
  oopbasics: lazy(() => import('./viz/JVMMemoryViz.jsx')),
  exception: lazy(() => import('./viz/ExceptionViz.jsx')),
  javalang: lazy(() => import('./viz/StringPoolViz.jsx')),
}

const CODE_LABEL = {
  python: 'Python', javascript: 'JavaScript', typescript: 'TypeScript',
  java: 'Java', c: 'C', cpp: 'C++', csharp: 'C#', go: 'Go',
  kotlin: 'Kotlin', rust: 'Rust', pseudo: '의사코드',
}

export default function TopicPage({ id, markVisited, recordScore, glossaryOn, onSelect }) {
  const topic = TOPIC_BY_ID[id]
  const questions = QUIZZES[id] || []
  const Viz = VIZ[id]
  const subj = SUBJECTS.find(s => s.id === topic.subject)
  const cat = subj && subj.categories.find(c => c.id === topic.category)

  const codeLangs = Object.keys(topic.code || {})
  const pgLang = topic.code && topic.code.python ? 'python' : 'javascript'
  const pgStarter = topic.code ? (topic.code.python || topic.code.javascript) : undefined
  const [codeLang, setCodeLang] = useState(codeLangs[0])
  const [copied, setCopied] = useState(false)
  const [activeSec, setActiveSec] = useState('concept')
  const navRef = useRef(null)

  const glossary = useMemo(
    () => (glossaryOn ? buildGlossary(topic.terminology) : null),
    [glossaryOn, id] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => { markVisited?.(id) }, [id, markVisited])

  const sections = [
    { key: 'concept', label: '개념' },
    topic.classification && { key: 'class', label: '분류' },
    topic.terminology && { key: 'term', label: '용어' },
    topic.mechanism && { key: 'mech', label: '동작 원리' },
    topic.adt && { key: 'adt', label: 'ADT' },
    topic.complexity && { key: 'complexity', label: '복잡도' },
    topic.comparison && { key: 'compare', label: '비교' },
    topic.representation && { key: 'repr', label: '표현' },
    topic.properties && { key: 'props', label: '특징' },
    { key: 'viz', label: '시각화' },
    { key: 'code', label: '코드' },
    { key: 'playground', label: '플레이그라운드' },
    { key: 'use', label: '활용' },
    questions.length > 0 && { key: 'quiz', label: '퀴즈' },
  ].filter(Boolean)

  const idx = Math.max(0, sections.findIndex(s => s.key === activeSec))
  const prev = sections[idx - 1]
  const next = sections[idx + 1]

  function selectSec(key) {
    setActiveSec(key)
    requestAnimationFrame(() => navRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  function copyCode() {
    navigator.clipboard.writeText(topic.code[codeLang]).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  // 코드 블록 — 코드 탭과 시각화 탭에서 공통으로 사용 (한 번에 하나만 렌더)
  function renderCode() {
    return (
      <div className="code-block">
        <div className="code-header">
          <select
            className="lang-select"
            value={codeLang}
            onChange={e => setCodeLang(e.target.value)}
            aria-label="코드 언어 선택"
          >
            {codeLangs.map(lang => (
              <option key={lang} value={lang}>{CODE_LABEL[lang] || lang}</option>
            ))}
          </select>
          <button className="copy-btn" onClick={copyCode}>{copied ? '복사됨' : '복사'}</button>
        </div>
        <pre className="code-pre"><code>{topic.code[codeLang]}</code></pre>
      </div>
    )
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

      <nav className="ds-toc" ref={navRef}>
        {sections.map(s => (
          <button
            key={s.key}
            className={'toc-chip' + (activeSec === s.key ? ' active' : '')}
            onClick={() => selectSec(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="topic-sections">
        {activeSec === 'concept' && (
          <section className="section">
            <h2 className="section-title">개념</h2>
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
        )}

        {activeSec === 'class' && (
          <section className="section">
            <h2 className="section-title">분류</h2>
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

        {activeSec === 'term' && (
          <section className="section">
            <h2 className="section-title">용어 정리</h2>
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

        {activeSec === 'mech' && (
          <section className="section">
            <h2 className="section-title">동작 원리</h2>
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

        {activeSec === 'adt' && (
          <section className="section">
            <h2 className="section-title">ADT (추상 자료형)</h2>
            <p className="adt-desc">{topic.adt.description}</p>
            <ADTDiagram adt={topic.adt} color={topic.color} />
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

        {activeSec === 'complexity' && (
          <section className="section">
            <h2 className="section-title">시간 복잡도</h2>
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

        {activeSec === 'compare' && (
          <section className="section">
            <h2 className="section-title">{topic.comparison.title}</h2>
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

        {activeSec === 'repr' && (
          <section className="section">
            <h2 className="section-title">표현 방법</h2>
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

        {activeSec === 'props' && (
          <section className="section">
            <h2 className="section-title">특징</h2>
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

        {activeSec === 'viz' && (
          <section className="section">
            <h2 className="section-title">직접 해보기</h2>
            <div className="viz-container" style={{ '--color': topic.color }}>
              {Viz && (
                <Suspense fallback={<div className="viz-loading">시각화를 불러오는 중…</div>}>
                  <Viz color={topic.color} />
                </Suspense>
              )}
            </div>
            {pgStarter ? (
              <div className="viz-playground-wrap">
                <div className="viz-playground-head">코드로 직접 실행해 보기 — 위 시각화의 동작을 코드로 체험하세요</div>
                <CodePlayground starterLang={pgLang} starterCode={pgStarter} color={topic.color} />
              </div>
            ) : codeLangs.length > 0 && (
              <div className="viz-code">
                <div className="viz-code-head">시각화와 함께 보는 소스 코드 — 흐름을 비교하며 학습하세요</div>
                {renderCode()}
              </div>
            )}
          </section>
        )}

        {activeSec === 'code' && (
          <section className="section">
            <h2 className="section-title">코드</h2>
            {renderCode()}
          </section>
        )}

        {activeSec === 'playground' && (
          <section className="section">
            <h2 className="section-title">코드 플레이그라운드</h2>
            <p className="adt-desc">직접 코드를 작성하고 실행해 결과를 확인하세요 — JavaScript·Python을 브라우저에서 바로 실행합니다.</p>
            <CodePlayground starterLang={pgLang} starterCode={pgStarter} color={topic.color} />
          </section>
        )}

        {activeSec === 'use' && (
          <section className="section">
            <h2 className="section-title">실제 활용</h2>
            <div className="use-grid">
              {topic.useCases.map((u, i) => {
                const name = typeof u === 'string' ? u : u.name
                const desc = typeof u === 'string' ? null : u.desc
                return (
                  <div key={i} className="use-card">
                    <span className="use-card-dot" style={{ background: topic.color }} />
                    <div className="use-card-body">
                      <div className="use-card-name">{name}</div>
                      {desc && <div className="use-card-desc"><RichText text={desc} glossary={glossary} /></div>}
                    </div>
                  </div>
                )
              })}
            </div>
            {topic.useCaseExample && (
              <div className="use-example" style={{ '--color': topic.color }}>
                <div className="use-example-head">
                  <span className="use-example-tag">활용 예제</span>
                  <span className="use-example-title">{topic.useCaseExample.title}</span>
                </div>
                <p className="use-example-desc">
                  <RichText text={topic.useCaseExample.desc} glossary={glossary} />
                </p>
                <div className="code-block">
                  <pre className="code-pre"><code>{topic.useCaseExample.code}</code></pre>
                </div>
              </div>
            )}
          </section>
        )}

        {activeSec === 'quiz' && questions.length > 0 && (
          <section className="section">
            <h2 className="section-title">퀴즈 ({questions.length}문제)</h2>
            <Quiz
              questions={questions}
              color={topic.color}
              onComplete={(score, total) => recordScore?.(id, Math.round((score / total) * 100))}
            />
          </section>
        )}

        <div className="sec-nav">
          <button
            className="sec-nav-btn prev"
            disabled={!prev}
            onClick={() => prev && selectSec(prev.key)}
          >
            {prev && <>← {prev.label}</>}
          </button>
          <span className="sec-nav-pos">{idx + 1} / {sections.length}</span>
          <button
            className="sec-nav-btn next"
            disabled={!next}
            onClick={() => next && selectSec(next.key)}
          >
            {next && <>{next.label} →</>}
          </button>
        </div>
      </div>
    </div>
  )
}
