import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const INIT_HEAP = [1, 3, 2, 7, 6, 5, 4]

export default function PriorityQueueViz({ color }) {
  const [heap, setHeap] = useState(INIT_HEAP)
  const [hl, setHl] = useState({})
  const [log, setLog] = useState('Min Heap – 부모 ≤ 자식. 항상 최솟값이 루트(인덱스 0)에 위치합니다.')
  const [busy, setBusy] = useState(false)
  const [inputVal, setInputVal] = useState('8')
  const abortRef = useRef(false)

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setHeap(INIT_HEAP); setHl({}); setLog('초기화됨'); setBusy(false) }, 50)
  }

  async function insert() {
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자 입력'); return }
    if (heap.length >= 15) { setLog('⚠️ 최대 15개'); return }
    setBusy(true); abortRef.current = false

    let h = [...heap, val]
    let i = h.length - 1
    setHeap([...h])
    setHl({ [i]: 'inserted' })
    setLog(`${val} 삽입 → 인덱스 ${i} (말단 노드)`)
    await sleep(500)

    while (i > 0) {
      if (abortRef.current) { setBusy(false); return }
      const parent = Math.floor((i - 1) / 2)
      setHl({ [i]: 'compare', [parent]: 'compare' })
      setLog(`h[${i}]=${h[i]} vs 부모 h[${parent}]=${h[parent]} — ${h[i] < h[parent] ? '스왑!' : '정렬 완료'}`)
      await sleep(500)
      if (h[i] >= h[parent]) break
      ;[h[i], h[parent]] = [h[parent], h[i]]
      setHeap([...h])
      setHl({ [parent]: 'swapped' })
      await sleep(300)
      i = parent
    }
    setHl({ [i]: 'found' })
    setLog(`insert(${val}) 완료 — O(log n)`)
    setBusy(false)
  }

  async function extractMin() {
    if (heap.length === 0) { setLog('⚠️ 힙이 비어있음'); return }
    setBusy(true); abortRef.current = false

    let h = [...heap]
    const minVal = h[0]
    setHl({ 0: 'delete' }); setLog(`최솟값 ${minVal} 추출 → 말단 노드를 루트로 이동`)
    await sleep(600)

    h[0] = h[h.length - 1]
    h.pop()
    setHeap([...h])

    let i = 0
    while (true) {
      if (abortRef.current) { setBusy(false); return }
      const l = 2 * i + 1, r = 2 * i + 2
      let smallest = i
      if (l < h.length && h[l] < h[smallest]) smallest = l
      if (r < h.length && h[r] < h[smallest]) smallest = r
      if (smallest === i) break
      setHl({ [i]: 'compare', [smallest]: 'compare' })
      setLog(`h[${i}]=${h[i]} > h[${smallest}]=${h[smallest]} — 스왑`)
      await sleep(500)
      ;[h[i], h[smallest]] = [h[smallest], h[i]]
      setHeap([...h])
      setHl({ [smallest]: 'swapped' })
      await sleep(300)
      i = smallest
    }
    setHl({})
    setLog(`extractMin() = ${minVal} 완료 — O(log n)`)
    setBusy(false)
  }

  const W = 460, LEVEL_Y = [30, 100, 170]
  const POS_X = {
    0: [W / 2],
    1: [W / 4, (W * 3) / 4],
    2: [W / 8, (W * 3) / 8, (W * 5) / 8, (W * 7) / 8],
  }

  function nodePos(i) {
    let depth = 0, start = 0
    while (start + (1 << depth) <= i) { start += 1 << depth; depth++ }
    const pos = i - start
    const x = (POS_X[depth] ?? [])[pos] ?? W / 2
    const y = LEVEL_Y[depth] ?? 240
    const parentIdx = depth > 0 ? start - (1 << (depth - 1)) + Math.floor(pos / 2) : null
    return { x, y, parentIdx, depth, pos }
  }

  const HL_COLOR = { inserted: '#10b981', found: '#10b981', compare: '#f59e0b', swapped: '#3b82f6', delete: '#ef4444' }

  return (
    <div className="viz">
      <svg width={W} height={210} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        {heap.map((v, i) => {
          const { parentIdx } = nodePos(i)
          if (parentIdx === null || parentIdx >= heap.length) return null
          const { x: px, y: py } = nodePos(parentIdx)
          const { x, y } = nodePos(i)
          return <line key={`e-${i}`} x1={px} y1={py} x2={x} y2={y} stroke="#334155" strokeWidth="1.8" />
        })}
        {heap.map((v, i) => {
          const { x, y } = nodePos(i)
          const hlType = hl[i]
          const hlC = HL_COLOR[hlType]
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={22}
                fill={hlC ? hlC + '33' : '#1e293b'}
                stroke={hlC || (i === 0 ? color : '#475569')} strokeWidth={i === 0 ? 2.5 : 2} />
              <text x={x} y={y + 5} textAnchor="middle" fontSize="13"
                fill={hlC ? hlC : (i === 0 ? color : '#e2e8f0')} fontWeight="700">{v}</text>
              <text x={x} y={y + 36} textAnchor="middle" fontSize="10" fill="#64748b">[{i}]</text>
            </g>
          )
        })}
      </svg>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', margin: '4px 0 8px' }}>
        {heap.map((v, i) => (
          <span key={i} style={{
            padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700,
            background: hl[i] ? (HL_COLOR[hl[i]] + '33') : '#1e293b',
            color: hl[i] ? HL_COLOR[hl[i]] : (i === 0 ? color : '#94a3b8'),
            border: `1px solid ${hl[i] ? HL_COLOR[hl[i]] : '#334155'}`
          }}>
            [{i}]{v}
          </span>
        ))}
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-inputs">
          <label>값 <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': '#10b981' }} onClick={insert} disabled={busy}>insert O(log n)</button>
          <button className="viz-btn" style={{ '--c': color }} onClick={extractMin} disabled={busy}>extractMin O(log n)</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
