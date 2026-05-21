import { useState } from 'react'

const NODES = {
  P1: { type: 'P', x: 115, y: 74,  label: 'P1' },
  P2: { type: 'P', x: 115, y: 210, label: 'P2' },
  R1: { type: 'R', x: 360, y: 74,  label: 'R1' },
  R2: { type: 'R', x: 360, y: 210, label: 'R2' },
}
const NR = 34

function hasCycle(alloc, request) {
  const adj = { P1: [], P2: [], R1: [], R2: [] }
  for (const r of ['R1', 'R2']) if (alloc[r]) adj[r].push(alloc[r])
  for (const p of ['P1', 'P2']) if (request[p]) adj[p].push(request[p])
  const mark = {}
  let cycle = null
  function dfs(u, path) {
    mark[u] = 1
    for (const v of adj[u]) {
      if (mark[v] === 1) { cycle = new Set(path.slice(path.indexOf(v))); return true }
      if (!mark[v] && dfs(v, [...path, v])) return true
    }
    mark[u] = 2
    return false
  }
  for (const n of Object.keys(NODES)) if (!mark[n] && dfs(n, [n])) break
  return cycle
}

export default function DeadlockViz({ color }) {
  const [alloc, setAlloc] = useState({ R1: null, R2: null })
  const [request, setRequest] = useState({ P1: null, P2: null })
  const [log, setLog] = useState('자원 할당·요청 버튼을 눌러 자원 할당 그래프(RAG)를 만들어보세요.')

  const cycle = hasCycle(alloc, request)
  const deadlock = cycle && cycle.size > 0

  const edges = []
  for (const r of ['R1', 'R2']) if (alloc[r]) edges.push({ from: r, to: alloc[r], kind: 'alloc' })
  for (const p of ['P1', 'P2']) if (request[p]) edges.push({ from: p, to: request[p], kind: 'request' })

  const actions = [
    { label: 'R1 → P1 할당', done: alloc.R1 === 'P1', run: () => { setAlloc(a => ({ ...a, R1: 'P1' })); setLog('R1을 P1에 할당 — 할당 간선 R1→P1') } },
    { label: 'R2 → P2 할당', done: alloc.R2 === 'P2', run: () => { setAlloc(a => ({ ...a, R2: 'P2' })); setLog('R2를 P2에 할당 — 할당 간선 R2→P2') } },
    { label: 'P1 → R2 요청', done: request.P1 === 'R2', run: () => { setRequest(r => ({ ...r, P1: 'R2' })); setLog('P1이 R2를 요청 — P1은 R1을 쥔 채 R2를 기다림 (점유 대기)') } },
    { label: 'P2 → R1 요청', done: request.P2 === 'R1', run: () => { setRequest(r => ({ ...r, P2: 'R1' })); setLog('P2가 R1을 요청 — 순환 대기 완성!') } },
  ]

  return (
    <div className="viz">
      {deadlock && (
        <div style={{ textAlign: 'center', padding: '8px', borderRadius: 10, background: '#ef444422',
          border: '1.5px solid #ef4444', color: '#fca5a5', fontWeight: 700, fontSize: 14 }}>
          ⛓️ 교착 상태 감지! — 자원 할당 그래프에 순환(P1→R2→P2→R1→P1)이 존재합니다.
        </div>
      )}

      <svg width={475} height={285} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        <defs>
          <marker id="dl-a" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
          </marker>
          <marker id="dl-c" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const a = NODES[e.from], b = NODES[e.to]
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.hypot(dx, dy)
          const ux = dx / dist, uy = dy / dist
          const inCyc = deadlock && cycle.has(e.from) && cycle.has(e.to)
          return (
            <g key={i}>
              <line x1={a.x + ux * NR} y1={a.y + uy * NR} x2={b.x - ux * NR} y2={b.y - uy * NR}
                stroke={inCyc ? '#ef4444' : e.kind === 'alloc' ? '#10b981' : '#f59e0b'}
                strokeWidth={inCyc ? 2.8 : 2}
                strokeDasharray={e.kind === 'request' ? '5 3' : '0'}
                markerEnd={inCyc ? 'url(#dl-c)' : 'url(#dl-a)'} />
            </g>
          )
        })}
        {Object.entries(NODES).map(([key, n]) => {
          const inCyc = deadlock && cycle.has(key)
          const stroke = inCyc ? '#ef4444' : n.type === 'P' ? color : '#22d3ee'
          return (
            <g key={key}>
              {n.type === 'P'
                ? <circle cx={n.x} cy={n.y} r={NR} fill={inCyc ? '#ef444422' : '#1e293b'} stroke={stroke} strokeWidth="2.5" />
                : <rect x={n.x - NR} y={n.y - NR} width={NR * 2} height={NR * 2} rx="8" fill={inCyc ? '#ef444422' : '#1e293b'} stroke={stroke} strokeWidth="2.5" />}
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="15" fontWeight="700"
                fill={inCyc ? '#fca5a5' : '#e2e8f0'}>{n.label}</text>
              {n.type === 'R' && <circle cx={n.x} cy={n.y - NR + 11} r="4" fill="#22d3ee" />}
            </g>
          )
        })}
        <text x={115} y={272} textAnchor="middle" fontSize="10" fill="#64748b">● 프로세스</text>
        <text x={360} y={272} textAnchor="middle" fontSize="10" fill="#64748b">■ 자원 (인스턴스 1개)</text>
      </svg>

      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', fontSize: 11, color: '#94a3b8' }}>
        <span><span style={{ color: '#10b981' }}>━</span> 할당 간선</span>
        <span><span style={{ color: '#f59e0b' }}>┅</span> 요청 간선</span>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          {actions.map((a, i) => (
            <button key={i} className="viz-btn" style={{ '--c': a.done ? '#475569' : color }}
              disabled={a.done} onClick={a.run}>{a.label}</button>
          ))}
          <button className="viz-btn reset" onClick={() => { setAlloc({ R1: null, R2: null }); setRequest({ P1: null, P2: null }); setLog('초기화됨') }}>초기화</button>
        </div>
      </div>
    </div>
  )
}
