import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const REFS = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
const N = 3

function simulate(algo) {
  const steps = []
  let frames = []
  const queue = []
  let recent = []
  for (let i = 0; i < REFS.length; i++) {
    const ref = REFS[i]
    let fault
    if (frames.includes(ref)) {
      fault = false
      if (algo === 'LRU') { recent = recent.filter(x => x !== ref); recent.push(ref) }
    } else {
      fault = true
      if (frames.length < N) {
        frames = [...frames, ref]
      } else {
        let victim
        if (algo === 'FIFO') victim = queue[0]
        else if (algo === 'LRU') victim = recent[0]
        else {
          let farthest = -1
          for (const f of frames) {
            let nxt = REFS.indexOf(f, i + 1)
            if (nxt === -1) nxt = Infinity
            if (nxt > farthest) { farthest = nxt; victim = f }
          }
        }
        frames = frames.map(x => (x === victim ? ref : x))
        if (algo === 'FIFO') queue.shift()
        if (algo === 'LRU') recent = recent.filter(x => x !== victim)
      }
      if (algo === 'FIFO') queue.push(ref)
      if (algo === 'LRU') recent.push(ref)
    }
    steps.push({ ref, frames: [...frames], fault })
  }
  return steps
}

export default function PageReplaceViz({ color }) {
  const [steps, setSteps] = useState(null)
  const [shown, setShown] = useState(0)
  const [algo, setAlgo] = useState(null)
  const [log, setLog] = useState('페이지 교체 알고리즘을 선택하세요. 프레임 3개, 참조열 13개.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function run(name) {
    setBusy(true); abortRef.current = false
    const sim = simulate(name)
    setAlgo(name); setSteps(sim); setShown(0)
    for (let i = 0; i < sim.length; i++) {
      if (abortRef.current) { setBusy(false); return }
      setShown(i + 1)
      const s = sim[i]
      setLog(`${name}: 페이지 ${s.ref} 참조 → ${s.fault ? '❌ 페이지 폴트' : '✅ 적중'}`)
      await sleep(520)
    }
    const faults = sim.filter(s => s.fault).length
    setLog(`${name} 완료 — 총 페이지 폴트 ${faults}회 / ${REFS.length}회 참조`)
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setSteps(null); setShown(0); setAlgo(null); setBusy(false); setLog('초기화됨') }, 50)
  }

  const faultsSoFar = steps ? steps.slice(0, shown).filter(s => s.fault).length : 0

  return (
    <div className="viz">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 12 }}>
          <tbody>
            <tr>
              <td style={{ color: '#64748b', fontSize: 10, padding: '2px 6px' }}>참조</td>
              {REFS.map((r, i) => {
                const cur = steps && i === shown - 1
                return (
                  <td key={i} style={{
                    width: 26, height: 24, textAlign: 'center', fontWeight: 700,
                    color: i < shown ? (cur ? color : '#e2e8f0') : '#334155',
                    background: cur ? color + '33' : 'transparent',
                    borderRadius: 5,
                  }}>{r}</td>
                )
              })}
            </tr>
            {[0, 1, 2].map(row => (
              <tr key={row}>
                <td style={{ color: '#64748b', fontSize: 10, padding: '2px 6px' }}>F{row}</td>
                {REFS.map((_, i) => {
                  const st = steps && i < shown ? steps[i] : null
                  const val = st ? st.frames[row] : undefined
                  return (
                    <td key={i} style={{
                      width: 26, height: 24, textAlign: 'center', fontWeight: 700,
                      border: '1px solid #1e293b',
                      background: val != null ? '#1e293b' : 'transparent',
                      color: '#cbd5e1',
                    }}>{val != null ? val : ''}</td>
                  )
                })}
              </tr>
            ))}
            <tr>
              <td style={{ color: '#64748b', fontSize: 10, padding: '2px 6px' }}>폴트</td>
              {REFS.map((_, i) => {
                const st = steps && i < shown ? steps[i] : null
                return (
                  <td key={i} style={{ width: 26, height: 20, textAlign: 'center', fontWeight: 800, fontSize: 11 }}>
                    {st ? (st.fault ? <span style={{ color: '#ef4444' }}>F</span> : <span style={{ color: '#10b981' }}>·</span>) : ''}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {steps && (
        <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
          페이지 폴트 <b style={{ color: '#fca5a5', fontSize: 15 }}>{faultsSoFar}</b>
          {shown === steps.length && <span style={{ color: '#64748b' }}> / {REFS.length}회 참조</span>}
        </div>
      )}

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={() => run('FIFO')}>FIFO</button>
          <button className="viz-btn" style={{ '--c': '#10b981' }} disabled={busy} onClick={() => run('LRU')}>LRU</button>
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} disabled={busy} onClick={() => run('Optimal')}>Optimal</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
        <p className="viz-hint">같은 참조열·프레임 수로 세 알고리즘의 페이지 폴트 수를 비교해보세요.</p>
      </div>
    </div>
  )
}
