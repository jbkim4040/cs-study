import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const PROCS = [
  { id: 'P1', arrival: 0, burst: 5, color: '#6366f1' },
  { id: 'P2', arrival: 1, burst: 3, color: '#10b981' },
  { id: 'P3', arrival: 2, burst: 6, color: '#f59e0b' },
  { id: 'P4', arrival: 4, burst: 2, color: '#ec4899' },
]
const QUANTUM = 2

function computeFCFS(procs) {
  const sorted = [...procs].sort((a, b) => a.arrival - b.arrival)
  let time = 0
  const segs = [], comp = {}
  for (const p of sorted) {
    const start = Math.max(time, p.arrival)
    const end = start + p.burst
    segs.push({ pid: p.id, start, end })
    comp[p.id] = end
    time = end
  }
  return { segs, comp }
}

function computeSJF(procs) {
  const done = {}
  let time = 0, count = 0
  const segs = [], comp = {}
  while (count < procs.length) {
    const avail = procs.filter(p => !done[p.id] && p.arrival <= time)
    if (!avail.length) {
      time = Math.min(...procs.filter(p => !done[p.id]).map(p => p.arrival))
      continue
    }
    avail.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival)
    const p = avail[0]
    segs.push({ pid: p.id, start: time, end: time + p.burst })
    time += p.burst
    comp[p.id] = time
    done[p.id] = true
    count++
  }
  return { segs, comp }
}

function computeRR(procs, q) {
  const sorted = [...procs].sort((a, b) => a.arrival - b.arrival)
  const rem = {}; procs.forEach(p => { rem[p.id] = p.burst })
  const segs = [], comp = {}
  let time = 0, idx = 0
  const queue = []
  const enqueue = t => { while (idx < sorted.length && sorted[idx].arrival <= t) queue.push(sorted[idx++].id) }
  enqueue(0)
  if (!queue.length && idx < sorted.length) { time = sorted[idx].arrival; enqueue(time) }
  while (queue.length) {
    const pid = queue.shift()
    const run = Math.min(q, rem[pid])
    const start = time, end = time + run
    const last = segs[segs.length - 1]
    if (last && last.pid === pid && last.end === start) last.end = end
    else segs.push({ pid, start, end })
    time = end
    rem[pid] -= run
    enqueue(time)
    if (rem[pid] > 0) queue.push(pid)
    else comp[pid] = end
    if (!queue.length && idx < sorted.length) { time = sorted[idx].arrival; enqueue(time) }
  }
  return { segs, comp }
}

const PC = Object.fromEntries(PROCS.map(p => [p.id, p.color]))
const UNIT = typeof window !== 'undefined' && window.innerWidth < 600 ? 16 : 32

export default function SchedulingViz({ color }) {
  const [result, setResult] = useState(null)
  const [shown, setShown] = useState(0)
  const [log, setLog] = useState('스케줄링 알고리즘을 선택하면 간트 차트와 평균 대기 시간을 보여줍니다.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function runAlgo(name) {
    setBusy(true); abortRef.current = false
    const res = name === 'FCFS' ? computeFCFS(PROCS) : name === 'SJF' ? computeSJF(PROCS) : computeRR(PROCS, QUANTUM)
    setResult(res); setShown(0)
    for (let i = 0; i < res.segs.length; i++) {
      if (abortRef.current) { setBusy(false); return }
      setShown(i + 1)
      const s = res.segs[i]
      setLog(`${name}: ${s.pid} 실행 [${s.start} ~ ${s.end}]`)
      await sleep(560)
    }
    const totalW = PROCS.reduce((sum, p) => sum + (res.comp[p.id] - p.arrival - p.burst), 0)
    const totalT = PROCS.reduce((sum, p) => sum + (res.comp[p.id] - p.arrival), 0)
    setLog(`${name} 완료 — 평균 대기 ${(totalW / PROCS.length).toFixed(2)} · 평균 반환 ${(totalT / PROCS.length).toFixed(2)}`)
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setResult(null); setShown(0); setBusy(false); setLog('초기화됨') }, 50)
  }

  const done = result && shown === result.segs.length

  return (
    <div className="viz">
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {PROCS.map(p => (
          <div key={p.id} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, background: '#1e293b', border: `1px solid ${p.color}` }}>
            <span style={{ color: p.color, fontWeight: 700 }}>{p.id}</span>
            <span style={{ color: '#94a3b8' }}> 도착 {p.arrival} · 실행 {p.burst}</span>
          </div>
        ))}
      </div>

      {result && (
        <div style={{ overflowX: 'auto', padding: '6px 2px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', minHeight: 44 }}>
            {result.segs.slice(0, shown).map((s, i) => (
              <div key={i} style={{
                width: (s.end - s.start) * UNIT, height: 40,
                background: PC[s.pid] + 'cc', borderRight: '2px solid #0f172a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 13,
                borderRadius: i === 0 ? '6px 0 0 6px' : 0,
              }}>{s.pid}</div>
            ))}
          </div>
          <div style={{ display: 'flex', height: 16, fontSize: 10, color: '#64748b' }}>
            {result.segs.slice(0, shown).map((s, i) => (
              <div key={i} style={{ width: (s.end - s.start) * UNIT, position: 'relative' }}>
                {i === 0 && <span style={{ position: 'absolute', left: -2 }}>{s.start}</span>}
                <span style={{ position: 'absolute', right: -6 }}>{s.end}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {done && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', fontSize: 11 }}>
          {PROCS.map(p => {
            const tat = result.comp[p.id] - p.arrival
            const wt = tat - p.burst
            return (
              <span key={p.id} style={{ padding: '3px 9px', borderRadius: 6, background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }}>
                <b style={{ color: PC[p.id] }}>{p.id}</b> 대기 {wt} · 반환 {tat}
              </span>
            )
          })}
        </div>
      )}

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={() => runAlgo('FCFS')}>FCFS</button>
          <button className="viz-btn" style={{ '--c': '#10b981' }} disabled={busy} onClick={() => runAlgo('SJF')}>SJF (비선점)</button>
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} disabled={busy} onClick={() => runAlgo('RR')}>RR (q={QUANTUM})</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
