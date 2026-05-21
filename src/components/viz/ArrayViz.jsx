import { useRef, useState } from 'react'

const INIT = [15, 42, 8, 73, 21, 56]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function ArrayViz({ color }) {
  const [arr, setArr] = useState(INIT)
  const [hl, setHl] = useState([]) // [{idx, type}]
  const [log, setLog] = useState('버튼을 눌러 연산을 실행해 보세요.')
  const [op, setOp] = useState(null) // 현재 O() 복잡도
  const [busy, setBusy] = useState(false)
  const [inputIdx, setInputIdx] = useState('2')
  const [inputVal, setInputVal] = useState('99')
  const abortRef = useRef(false)

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setArr(INIT)
      setHl([])
      setLog('버튼을 눌러 연산을 실행해 보세요.')
      setOp(null)
      setBusy(false)
    }, 50)
  }

  async function access() {
    const idx = parseInt(inputIdx)
    if (isNaN(idx) || idx < 0 || idx >= arr.length) {
      setLog(`⚠️ 인덱스는 0 ~ ${arr.length - 1} 사이여야 합니다.`)
      return
    }
    setHl([{ idx, type: 'access' }])
    setOp('O(1)')
    setLog(`arr[${idx}] = ${arr[idx]}  ← 인덱스로 주소를 바로 계산해 접근!`)
  }

  async function search() {
    const val = parseInt(inputVal)
    setBusy(true)
    setOp('O(n)')
    abortRef.current = false
    for (let i = 0; i < arr.length; i++) {
      if (abortRef.current) break
      setHl([{ idx: i, type: 'compare' }])
      setLog(`arr[${i}] = ${arr[i]} 확인 중…`)
      await sleep(500)
      if (arr[i] === val) {
        setHl([{ idx: i, type: 'found' }])
        setLog(`✓ ${val}을(를) 인덱스 ${i}에서 발견!`)
        setBusy(false)
        return
      }
    }
    if (!abortRef.current) {
      setHl([])
      setLog(`${val}을(를) 배열에서 찾지 못했습니다.`)
    }
    setBusy(false)
  }

  async function insertMiddle() {
    const idx = parseInt(inputIdx)
    const val = parseInt(inputVal)
    if (isNaN(idx) || idx < 0 || idx > arr.length) {
      setLog(`⚠️ 인덱스는 0 ~ ${arr.length} 사이여야 합니다.`)
      return
    }
    setBusy(true)
    setOp('O(n)')
    abortRef.current = false
    // 이동할 요소들 하이라이트
    for (let i = arr.length - 1; i >= idx; i--) {
      if (abortRef.current) { setBusy(false); return }
      setHl([{ idx: i, type: 'shift' }])
      setLog(`arr[${i}] → arr[${i + 1}] 로 이동 중…`)
      await sleep(300)
    }
    const newArr = [...arr.slice(0, idx), val, ...arr.slice(idx)]
    setArr(newArr)
    setHl([{ idx, type: 'inserted' }])
    setLog(`✓ 인덱스 ${idx}에 ${val} 삽입 완료! (${arr.length}개 요소가 이동됨)`)
    setBusy(false)
  }

  async function deleteMiddle() {
    const idx = parseInt(inputIdx)
    if (isNaN(idx) || idx < 0 || idx >= arr.length) {
      setLog(`⚠️ 인덱스는 0 ~ ${arr.length - 1} 사이여야 합니다.`)
      return
    }
    setBusy(true)
    setOp('O(n)')
    abortRef.current = false
    setHl([{ idx, type: 'delete' }])
    setLog(`arr[${idx}] = ${arr[idx]} 삭제 중…`)
    await sleep(500)
    for (let i = idx + 1; i < arr.length; i++) {
      if (abortRef.current) { setBusy(false); return }
      setHl([{ idx: i, type: 'shift' }])
      setLog(`arr[${i}] → arr[${i - 1}] 로 당기는 중…`)
      await sleep(300)
    }
    const newArr = arr.filter((_, i) => i !== idx)
    setArr(newArr)
    setHl([])
    setLog(`✓ 인덱스 ${idx} 삭제 완료! (${arr.length - idx - 1}개 요소가 이동됨)`)
    setBusy(false)
  }

  const TYPE_COLOR = {
    access: color,
    compare: '#f59e0b',
    found: '#10b981',
    shift: '#ef4444',
    inserted: '#10b981',
    delete: '#ef4444',
  }

  return (
    <div className="viz">
      <div className="viz-array-row">
        {arr.map((v, i) => {
          const h = hl.find(h => h.idx === i)
          return (
            <div
              key={i}
              className={'arr-box' + (h ? ' hl' : '')}
              style={h ? { '--hl': TYPE_COLOR[h.type] } : {}}
            >
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
          <label>인덱스 <input type="number" value={inputIdx} min={0} max={arr.length} onChange={e => setInputIdx(e.target.value)} className="viz-input" /></label>
          <label>값 <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={access} disabled={busy}>접근 O(1)</button>
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} onClick={search} disabled={busy}>탐색 O(n)</button>
          <button className="viz-btn" style={{ '--c': '#3b82f6' }} onClick={insertMiddle} disabled={busy}>중간 삽입 O(n)</button>
          <button className="viz-btn" style={{ '--c': '#ef4444' }} onClick={deleteMiddle} disabled={busy}>중간 삭제 O(n)</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
