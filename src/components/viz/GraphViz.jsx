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
  [0, 1], [0, 2],
  [1, 3], [1, 4],
  [2, 4], [2, 5],
  [3, 4], [4, 5],
]

const ADJ = Array.from({ length: 6 }, () => Array(6).fill(0))
EDGES.forEach(([a, b]) => { ADJ[a][b] = 1; ADJ[b][a] = 1 })

const LABELS = 'ABCDEF'.split('')

export default function GraphViz({ color }) {
  const [hlNodes, setHlNodes] = useState({})
  const [hlEdges, setHlEdges] = useState(new Set())
  const [order, setOrder] = useState([])
  const [log, setLog] = useState('BFS / DFS 탐색을 직접 실행해보세요. 시작 노드: A(0)')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setHlNodes({}); setHlEdges(new Set()); setOrder([]); setLog('초기화됨'); setBusy(false) }, 50)
  }

  async function bfs() {
    setBusy(true); abortRef.current = false
    setHlNodes({}); setHlEdges(new Set()); setOrder([])
    const visited = Array(6).fill(false)
    const queue = [0], visitedOrder = []
    visited[0] = true

    while (queue.length) {
      if (abortRef.current) { setBusy(false); return }
      const cur = queue.shift()
      visitedOrder.push(cur)
      setHlNodes(h => ({ ...h, [cur]: 'visited' }))
      setOrder([...visitedOrder])
      setLog(`BFS 방문: ${visitedOrder.map(i => LABELS[i]).join(' → ')}`)
      await sleep(550)

      for (let nb = 0; nb < 6; nb++) {
        if (ADJ[cur][nb] && !visited[nb]) {
          visited[nb] = true
          queue.push(nb)
          const edgeKey = [Math.min(cur, nb), Math.max(cur, nb)].join('-')
          setHlEdges(s => new Set([...s, edgeKey]))
        }
      }
    }
    setLog(`BFS 완료: [${visitedOrder.map(i => LABELS[i]).join(', ')}]`)
    setBusy(false)
  }

  async function dfs() {
    setBusy(true); abortRef.current = false
    setHlNodes({}); setHlEdges(new Set()); setOrder([])
    const visited = Array(6).fill(false)
    const visitedOrder = []

    async function dfsVisit(cur) {
      if (abortRef.current || visited[cur]) return
      visited[cur] = true
      visitedOrder.push(cur)
      setHlNodes(h => ({ ...h, [cur]: 'visited' }))
      setOrder([...visitedOrder])
      setLog(`DFS 방문: ${visitedOrder.map(i => LABELS[i]).join(' → ')}`)
      await sleep(550)

      for (let nb = 0; nb < 6; nb++) {
        if (ADJ[cur][nb] && !visited[nb]) {
          const edgeKey = [Math.min(cur, nb), Math.max(cur, nb)].join('-')
          setHlEdges(s => new Set([...s, edgeKey]))
          await dfsVisit(nb)
          if (abortRef.current) return
        }
      }
    }

    await dfsVisit(0)
    if (!abortRef.current) setLog(`DFS 완료: [${visitedOrder.map(i => LABELS[i]).join(', ')}]`)
    setBusy(false)
  }

  return (
    <div className="viz">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <svg width={320} height={290} style={{ flexShrink: 0 }}>
          {EDGES.map(([a, b]) => {
            const na = NODES[a], nb = NODES[b]
            const edgeKey = [Math.min(a, b), Math.max(a, b)].join('-')
            const active = hlEdges.has(edgeKey)
            return (
              <line key={edgeKey}
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={active ? color : '#334155'} strokeWidth={active ? 2.5 : 1.5} />
            )
          })}
          {NODES.map(n => {
            const hl = hlNodes[n.id]
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={22}
                  fill={hl ? color + '33' : '#1e293b'}
                  stroke={hl ? color : '#475569'} strokeWidth="2" />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14"
                  fill={hl ? color : '#e2e8f0'} fontWeight="700">{n.label}</text>
              </g>
            )
          })}
        </svg>

        <div style={{ minWidth: 140 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>인접 행렬</div>
          <table style={{ borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr>
                <td style={{ padding: '2px 5px', color: '#475569' }}></td>
                {LABELS.map(l => <th key={l} style={{ padding: '2px 5px', color: color, fontWeight: 700 }}>{l}</th>)}
              </tr>
            </thead>
            <tbody>
              {ADJ.map((row, i) => (
                <tr key={i}>
                  <th style={{ padding: '2px 5px', color: color, fontWeight: 700 }}>{LABELS[i]}</th>
                  {row.map((v, j) => (
                    <td key={j} style={{
                      padding: '2px 5px', textAlign: 'center',
                      color: v === 1 ? '#e2e8f0' : '#475569',
                      background: v === 1 && (hlNodes[i] || hlNodes[j]) ? color + '22' : 'transparent'
                    }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {order.length > 0 && (
        <div style={{ textAlign: 'center', fontSize: '13px', margin: '6px 0 4px' }}>
          {order.map((v, i) => (
            <span key={i} style={{ color, marginRight: 4 }}>{LABELS[v]}{i < order.length - 1 ? ' →' : ''}</span>
          ))}
        </div>
      )}

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={bfs} disabled={busy}>BFS 너비 우선</button>
          <button className="viz-btn" style={{ '--c': '#8b5cf6' }} onClick={dfs} disabled={busy}>DFS 깊이 우선</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
