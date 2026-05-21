import { useRef, useState } from 'react'

const INIT = [10, 20, 30, 40, 50]
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function ListViz({ color }) {
  const [list, setList] = useState(INIT)
  const [hl, setHl] = useState([])
  const [log, setLog] = useState('리스트 연산을 직접 실행해보세요.')
  const [op, setOp] = useState(null)
  const [busy, setBusy] = useState(false)
  const [inputIdx, setInputIdx] = useState('2')
  const [inputVal, setInputVal] = useState('99')
  const abortRef = useRef(false)

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setList(INIT); setHl([]); setLog('초기화됨'); setOp(null); setBusy(false) }, 50)
  }

  function access() {
    const idx = parseInt(inputIdx)
    if (isNaN(idx) || idx < 0 || idx >= list.length) { setLog(`⚠️ 인덱스는 0~${list.length - 1}`); return }
    setHl([{ idx, type: 'access' }]); setOp('O(1)')
    setLog(`get(${idx}) = ${list[idx]}  ← 인덱스로 주소 직접 계산 → O(1)`)
  }

  async function search() {
    const val = parseInt(inputVal); setBusy(true); setOp('O(n)'); abortRef.current = false
    for (let i = 0; i < list.length; i++) {
      if (abortRef.current) break
      setHl([{ idx: i, type: 'compare' }]); setLog(`list[${i}]=${list[i]} 확인 중…`)
      await sleep(450)
      if (list[i] === val) { setHl([{ idx: i, type: 'found' }]); setLog(`✓ ${val} 인덱스 ${i}에서 발견! O(n)`); setBusy(false); return }
    }
    if (!abortRef.current) { setHl([]); setLog(`${val} 찾지 못함 O(n)`) }
    setBusy(false)
  }

  async function addAt() {
    const idx = parseInt(inputIdx); const val = parseInt(inputVal)
    if (isNaN(idx) || idx < 0 || idx > list.length) { setLog(`⚠️ 인덱스는 0~${list.length}`); return }
    setBusy(true); setOp('O(n)'); abortRef.current = false
    for (let i = list.length - 1; i >= idx; i--) {
      if (abortRef.current) { setBusy(false); return }
      setHl([{ idx: i, type: 'shift' }]); setLog(`list[${i}] → list[${i + 1}] 이동 중…`); await sleep(300)
    }
    setList(l => [...l.slice(0, idx), val, ...l.slice(idx)])
    setHl([{ idx, type: 'inserted' }]); setLog(`add(${idx}, ${val}) 완료! ${list.length - idx}개 원소 이동 → O(n)`)
    setBusy(false)
  }

  async function removeAt() {
    const idx = parseInt(inputIdx)
    if (isNaN(idx) || idx < 0 || idx >= list.length) { setLog(`⚠️ 인덱스는 0~${list.length - 1}`); return }
    setBusy(true); setOp('O(n)'); abortRef.current = false
    setHl([{ idx, type: 'delete' }]); await sleep(500)
    for (let i = idx + 1; i < list.length; i++) {
      if (abortRef.current) { setBusy(false); return }
      setHl([{ idx: i, type: 'shift' }]); setLog(`list[${i}] → list[${i - 1}] 당기는 중…`); await sleep(300)
    }
    setList(l => l.filter((_, i) => i !== idx))
    setHl([]); setLog(`remove(${idx}) 완료! O(n)`)
    setBusy(false)
  }

  const HL_COLOR = { access: color, compare: '#f59e0b', found: '#10b981', shift: '#ef4444', inserted: '#10b981', delete: '#ef4444' }

  return (
    <div className="viz">
      <div className="viz-array-row">
        {list.map((v, i) => {
          const h = hl.find(h => h.idx === i)
          return (
            <div key={i} className={'arr-box' + (h ? ' hl' : '')} style={h ? { '--hl': HL_COLOR[h.type] } : {}}>
              <div className="arr-val">{v}</div>
              <div className="arr-idx">[{i}]</div>
            </div>
          )
        })}
      </div>
      <div className="viz-log">
        {op && <span className="op-badge" style={{ '--color': color }}>{op}</span>}
        <span>{log}</span>
      </div>
      <div className="viz-controls">
        <div className="viz-inputs">
          <label>인덱스 <input type="number" value={inputIdx} onChange={e => setInputIdx(e.target.value)} className="viz-input" /></label>
          <label>값 <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={access} disabled={busy}>get O(1)</button>
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} onClick={search} disabled={busy}>탐색 O(n)</button>
          <button className="viz-btn" style={{ '--c': '#3b82f6' }} onClick={addAt} disabled={busy}>add 삽입 O(n)</button>
          <button className="viz-btn" style={{ '--c': '#ef4444' }} onClick={removeAt} disabled={busy}>remove 삭제 O(n)</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
