import { useState } from 'react'

const SIZE = 8

function hashFn(key) {
  let h = 0
  for (const c of String(key)) h = (h * 31 + c.charCodeAt(0)) % SIZE
  return h
}

const INIT_DATA = [
  { key: 'apple', val: '사과' },
  { key: 'banana', val: '바나나' },
]

function buildBuckets(data) {
  const b = Array.from({ length: SIZE }, () => [])
  data.forEach(({ key, val }) => b[hashFn(key)].push({ key, val }))
  return b
}

export default function HashViz({ color }) {
  const [data, setData] = useState(INIT_DATA)
  const [buckets, setBuckets] = useState(() => buildBuckets(INIT_DATA))
  const [inputKey, setInputKey] = useState('mango')
  const [inputVal, setInputVal] = useState('망고')
  const [hl, setHl] = useState(null) // bucket index
  const [log, setLog] = useState('키-값 쌍을 삽입하거나 탐색해 보세요.')
  const [calcStep, setCalcStep] = useState(null)

  function doInsert() {
    const key = inputKey.trim()
    const val = inputVal.trim()
    if (!key) { setLog('⚠️ 키를 입력하세요.'); return }
    const h = hashFn(key)
    setCalcStep({ key, h, op: '삽입' })
    setHl(h)
    setLog(`hash("${key}") % ${SIZE} = ${h} → 버킷 ${h}에 저장`)
    setTimeout(() => {
      const newData = data.filter(d => d.key !== key).concat({ key, val })
      setData(newData)
      setBuckets(buildBuckets(newData))
      setTimeout(() => { setHl(null); setCalcStep(null) }, 600)
    }, 800)
  }

  function doSearch() {
    const key = inputKey.trim()
    if (!key) { setLog('⚠️ 키를 입력하세요.'); return }
    const h = hashFn(key)
    setCalcStep({ key, h, op: '탐색' })
    setHl(h)
    const found = data.find(d => d.key === key)
    setTimeout(() => {
      if (found) setLog(`✓ hash("${key}") = ${h} → 버킷 ${h}에서 "${found.val}" 발견! O(1)`)
      else setLog(`hash("${key}") = ${h} → 버킷 ${h}에 "${key}" 없음`)
      setTimeout(() => { setHl(null); setCalcStep(null) }, 1000)
    }, 800)
  }

  function doDelete() {
    const key = inputKey.trim()
    if (!key) { setLog('⚠️ 키를 입력하세요.'); return }
    const h = hashFn(key)
    setHl(h)
    const found = data.find(d => d.key === key)
    if (!found) { setLog(`"${key}"을(를) 찾을 수 없습니다.`); setTimeout(() => setHl(null), 600); return }
    setTimeout(() => {
      const newData = data.filter(d => d.key !== key)
      setData(newData)
      setBuckets(buildBuckets(newData))
      setLog(`✓ hash("${key}") = ${h} → 버킷 ${h}에서 삭제 완료! O(1)`)
      setHl(null)
    }, 700)
  }

  function reset() {
    setData(INIT_DATA)
    setBuckets(buildBuckets(INIT_DATA))
    setHl(null)
    setCalcStep(null)
    setLog('키-값 쌍을 삽입하거나 탐색해 보세요.')
  }

  return (
    <div className="viz">
      {calcStep && (
        <div className="hash-calc" style={{ '--color': color }}>
          <span>hash(<strong>"{calcStep.key}"</strong>)</span>
          <span className="hash-arrow">→</span>
          <span><strong>{calcStep.h}</strong> % {SIZE}</span>
          <span className="hash-arrow">→</span>
          <span className="hash-bucket-badge">버킷 {calcStep.h}</span>
        </div>
      )}

      <div className="hash-table">
        {buckets.map((chain, i) => (
          <div
            key={i}
            className={'hash-row' + (hl === i ? ' hl' : '')}
            style={hl === i ? { '--c': color } : {}}
          >
            <div className="hash-idx">{i}</div>
            <div className="hash-chain">
              {chain.length === 0
                ? <span className="hash-null">null</span>
                : chain.map((item, j) => (
                    <span key={j} className="hash-item">
                      <span className="hash-key">"{item.key}"</span>
                      <span className="hash-sep">:</span>
                      <span className="hash-val">"{item.val}"</span>
                      {j < chain.length - 1 && <span className="hash-link">→</span>}
                    </span>
                  ))
              }
            </div>
          </div>
        ))}
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-inputs">
          <label>키 <input type="text" value={inputKey} onChange={e => setInputKey(e.target.value)} className="viz-input" style={{ width: 90 }} /></label>
          <label>값 <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} className="viz-input" style={{ width: 90 }} /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': '#10b981' }} onClick={doInsert}>삽입</button>
          <button className="viz-btn" style={{ '--c': color }} onClick={doSearch}>탐색</button>
          <button className="viz-btn" style={{ '--c': '#ef4444' }} onClick={doDelete}>삭제</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
