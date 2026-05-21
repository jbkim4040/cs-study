import { useState, useRef } from 'react'

const INIT = [10, 20, 30, 40, 50]
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function CircularViz({ color }) {
  const [nodes, setNodes] = useState(INIT)
  const [hl, setHl] = useState([])
  const [log, setLog] = useState('원형 연결 리스트 – 마지막 노드가 첫 번째를 가리킵니다.')
  const [busy, setBusy] = useState(false)
  const [inputVal, setInputVal] = useState('99')
  const abortRef = useRef(false)

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setNodes(INIT); setHl([]); setLog('초기화됨'); setBusy(false) }, 50)
  }

  async function traverse() {
    setBusy(true); abortRef.current = false
    setLog('순회 시작 (tail → head 순환)…')
    for (let i = 0; i < nodes.length; i++) {
      if (abortRef.current) { setBusy(false); return }
      setHl([i]); setLog(`노드[${i}] = ${nodes[i]}  → 다음: ${nodes[(i + 1) % nodes.length]}`)
      await sleep(500)
    }
    setHl([0]); setLog(`순환 완료! 마지막 노드 → 다시 head(${nodes[0]})로 돌아옴`)
    setBusy(false)
  }

  async function detectCycle() {
    setBusy(true); abortRef.current = false
    setLog('Floyd 사이클 감지: slow(1칸) / fast(2칸) 포인터…')
    let s = 0, f = 0
    const steps = nodes.length * 2 + 2
    for (let step = 0; step < steps; step++) {
      if (abortRef.current) { setBusy(false); return }
      setHl([s, f]); setLog(`slow=${nodes[s]}(idx ${s})  fast=${nodes[f]}(idx ${f})`)
      await sleep(500)
      s = (s + 1) % nodes.length
      f = (f + 2) % nodes.length
      if (s === f) { setHl([s]); setLog(`✓ 사이클 감지! slow=fast=idx ${s} (${nodes[s]})`); setBusy(false); return }
    }
    setHl([]); setLog('사이클 없음')
    setBusy(false)
  }

  function addTail() {
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요'); return }
    setNodes(n => [...n, val])
    setHl([nodes.length]); setLog(`tail에 ${val} 삽입 완료`)
    setTimeout(() => setHl([]), 800)
  }

  function removeTail() {
    if (nodes.length <= 1) { setLog('⚠️ 노드가 1개 이하'); return }
    setNodes(n => n.slice(0, -1))
    setHl([]); setLog('tail 노드 삭제 완료')
  }

  const CX = 160, CY = 160, R = 110
  const nodeR = 24

  return (
    <div className="viz">
      <svg width="320" height="320" style={{ display: 'block', margin: '0 auto' }}>
        {nodes.map((v, i) => {
          const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2
          const nx = CX + R * Math.cos(angle)
          const ny = CY + R * Math.sin(angle)
          const nextAngle = (2 * Math.PI * ((i + 1) % nodes.length)) / nodes.length - Math.PI / 2
          const nnx = CX + R * Math.cos(nextAngle)
          const nny = CY + R * Math.sin(nextAngle)
          const highlighted = hl.includes(i)

          const dx = nnx - nx, dy = nny - ny
          const dist = Math.sqrt(dx * dx + dy * dy)
          const ux = dx / dist, uy = dy / dist
          const ax = nx + ux * nodeR, ay = ny + uy * nodeR
          const bx = nnx - ux * nodeR, by = nny - uy * nodeR

          return (
            <g key={i}>
              <defs>
                <marker id={`arr-${i}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={highlighted ? color : '#94a3b8'} />
                </marker>
              </defs>
              <line x1={ax} y1={ay} x2={bx} y2={by}
                stroke={highlighted ? color : '#94a3b8'} strokeWidth="1.5"
                markerEnd={`url(#arr-${i})`} />
              <circle cx={nx} cy={ny} r={nodeR}
                fill={highlighted ? color + '33' : '#1e293b'}
                stroke={highlighted ? color : '#475569'} strokeWidth="2" />
              <text x={nx} y={ny + 5} textAnchor="middle" fontSize="13" fill={highlighted ? color : '#e2e8f0'} fontWeight="600">
                {v}
              </text>
              <text x={nx} y={ny + nodeR + 14} textAnchor="middle" fontSize="10" fill="#64748b">[{i}]</text>
            </g>
          )
        })}
        <text x={CX} y={CY + 6} textAnchor="middle" fontSize="11" fill="#475569">순환</text>
      </svg>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-inputs">
          <label>값 <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={traverse} disabled={busy}>순회 O(n)</button>
          <button className="viz-btn" style={{ '--c': '#8b5cf6' }} onClick={detectCycle} disabled={busy}>Floyd 사이클 감지</button>
          <button className="viz-btn" style={{ '--c': '#10b981' }} onClick={addTail} disabled={busy}>tail 삽입</button>
          <button className="viz-btn" style={{ '--c': '#ef4444' }} onClick={removeTail} disabled={busy}>tail 삭제</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
