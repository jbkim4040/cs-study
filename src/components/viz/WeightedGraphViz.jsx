import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const NODES = [
  { id: 0, label: 'A', x: 160, y: 40 },
  { id: 1, label: 'B', x: 60,  y: 130 },
  { id: 2, label: 'C', x: 260, y: 130 },
  { id: 3, label: 'D', x: 40,  y: 240 },
  { id: 4, label: 'E', x: 160, y: 240 },
  { id: 5, label: 'F', x: 280, y: 240 },
]

const EDGES = [
  { a: 0, b: 1, w: 4 },
  { a: 0, b: 2, w: 2 },
  { a: 1, b: 3, w: 5 },
  { a: 1, b: 4, w: 1 },
  { a: 2, b: 4, w: 8 },
  { a: 2, b: 5, w: 10 },
  { a: 3, b: 4, w: 2 },
  { a: 4, b: 5, w: 3 },
]

const INF = 1e9
const LABELS = 'ABCDEF'.split('')
const N = 6

function buildAdj() {
  const adj = Array.from({ length: N }, () => [])
  EDGES.forEach(({ a, b, w }) => { adj[a].push({ to: b, w }); adj[b].push({ to: a, w }) })
  return adj
}

const ADJ = buildAdj()

export default function WeightedGraphViz({ color }) {
  const [dist, setDist] = useState(Array(N).fill(INF))
  const [prev, setPrev] = useState(Array(N).fill(-1))
  const [hlNodes, setHlNodes] = useState({})
  const [hlEdges, setHlEdges] = useState(new Set())
  const [log, setLog] = useState('Dijkstra 알고리즘으로 A에서 모든 노드까지 최단 경로를 구합니다.')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const abortRef = useRef(false)

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setDist(Array(N).fill(INF)); setPrev(Array(N).fill(-1))
      setHlNodes({}); setHlEdges(new Set())
      setLog('Dijkstra 알고리즘으로 A에서 모든 노드까지 최단 경로를 구합니다.')
      setBusy(false); setDone(false)
    }, 50)
  }

  async function dijkstra() {
    setBusy(true); abortRef.current = false; setDone(false)
    const d = Array(N).fill(INF)
    const p = Array(N).fill(-1)
    const visited = Array(N).fill(false)
    d[0] = 0
    setDist([...d])

    for (let step = 0; step < N; step++) {
      if (abortRef.current) { setBusy(false); return }

      let u = -1
      for (let i = 0; i < N; i++) {
        if (!visited[i] && (u === -1 || d[i] < d[u])) u = i
      }
      if (d[u] === INF) break

      visited[u] = true
      setHlNodes(h => ({ ...h, [u]: 'current' }))
      setLog(`최소 dist: ${LABELS[u]}(${d[u]}) 확정`)
      await sleep(600)

      for (const { to, w } of ADJ[u]) {
        if (abortRef.current) { setBusy(false); return }
        const edgeKey = [Math.min(u, to), Math.max(u, to)].join('-')
        setHlEdges(s => new Set([...s, edgeKey]))
        if (d[u] + w < d[to]) {
          d[to] = d[u] + w
          p[to] = u
          setDist([...d]); setPrev([...p])
          setHlNodes(h => ({ ...h, [to]: 'relaxed' }))
          setLog(`완화: dist[${LABELS[to]}] = ${d[u]} + ${w} = ${d[to]}`)
          await sleep(400)
        }
      }
      setHlNodes(h => ({ ...h, [u]: 'done' }))
    }

    setDist([...d]); setPrev([...p])
    setLog(`Dijkstra 완료! A에서 각 노드 최단 거리 — ${LABELS.map((l, i) => `${l}:${d[i]}`).join(', ')}`)
    setBusy(false); setDone(true)
  }

  const HL_COLOR = { current: color, relaxed: '#f59e0b', done: '#10b981' }
  const edgeColorMap = {}
  EDGES.forEach(({ a, b }) => {
    const key = [Math.min(a, b), Math.max(a, b)].join('-')
    edgeColorMap[key] = hlEdges.has(key)
  })

  return (
    <div className="viz">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <svg width={320} height={290} style={{ flexShrink: 0 }}>
          {EDGES.map(({ a, b, w }) => {
            const na = NODES[a], nb = NODES[b]
            const key = [Math.min(a, b), Math.max(a, b)].join('-')
            const active = hlEdges.has(key)
            const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2
            return (
              <g key={key}>
                <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={active ? color : '#334155'} strokeWidth={active ? 2.5 : 1.5} />
                <rect x={mx - 10} y={my - 9} width={20} height={16} rx={3} fill="#0f172a" />
                <text x={mx} y={my + 3} textAnchor="middle" fontSize="11"
                  fill={active ? color : '#94a3b8'} fontWeight="700">{w}</text>
              </g>
            )
          })}
          {NODES.map(n => {
            const hlType = hlNodes[n.id]
            const hlC = HL_COLOR[hlType]
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={22}
                  fill={hlC ? hlC + '33' : '#1e293b'}
                  stroke={hlC || '#475569'} strokeWidth="2" />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="13"
                  fill={hlC || '#e2e8f0'} fontWeight="700">{n.label}</text>
              </g>
            )
          })}
        </svg>

        <div style={{ minWidth: 120 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>최단 거리 테이블</div>
          {LABELS.map((l, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4,
              background: hlNodes[i] ? (HL_COLOR[hlNodes[i]] + '22') : 'transparent',
              borderRadius: 6, padding: '2px 6px'
            }}>
              <span style={{ fontWeight: 700, color: hlNodes[i] ? HL_COLOR[hlNodes[i]] : color, width: 18 }}>{l}</span>
              <span style={{ fontSize: 13, color: dist[i] === INF ? '#475569' : '#e2e8f0', fontWeight: 600 }}>
                {dist[i] === INF ? '∞' : dist[i]}
              </span>
              {prev[i] !== -1 && (
                <span style={{ fontSize: 11, color: '#64748b' }}>← {LABELS[prev[i]]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={dijkstra} disabled={busy}>Dijkstra 실행</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
