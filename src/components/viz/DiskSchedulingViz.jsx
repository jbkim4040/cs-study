import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const HEAD = 53
const REQUESTS = [98, 183, 37, 122, 14, 124, 65, 67]
const MAX_CYL = 199

function computePath(algo) {
  if (algo === 'FCFS') return [HEAD, ...REQUESTS]
  if (algo === 'SSTF') {
    const path = [HEAD]
    let cur = HEAD
    const left = [...REQUESTS]
    while (left.length) {
      let bi = 0
      for (let i = 1; i < left.length; i++)
        if (Math.abs(left[i] - cur) < Math.abs(left[bi] - cur)) bi = i
      cur = left[bi]; path.push(cur); left.splice(bi, 1)
    }
    return path
  }
  if (algo === 'SCAN') {
    const up = REQUESTS.filter(r => r >= HEAD).sort((a, b) => a - b)
    const down = REQUESTS.filter(r => r < HEAD).sort((a, b) => b - a)
    return [HEAD, ...up, MAX_CYL, ...down]
  }
  // C-SCAN
  const up = REQUESTS.filter(r => r >= HEAD).sort((a, b) => a - b)
  const rest = REQUESTS.filter(r => r < HEAD).sort((a, b) => a - b)
  return [HEAD, ...up, MAX_CYL, 0, ...rest]
}

function totalMovement(path) {
  let t = 0
  for (let i = 1; i < path.length; i++) t += Math.abs(path[i] - path[i - 1])
  return t
}

const W = 460, PAD = 46, ROW = 26

export default function DiskSchedulingViz({ color }) {
  const [path, setPath] = useState(null)
  const [shown, setShown] = useState(0)
  const [algo, setAlgo] = useState(null)
  const [log, setLog] = useState(`디스크 스케줄링 알고리즘을 선택하세요. 헤드 시작 ${HEAD}, 요청 ${REQUESTS.length}개.`)
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  const x = pos => PAD + (pos / MAX_CYL) * (W - PAD * 2)

  async function run(name) {
    setBusy(true); abortRef.current = false
    const p = computePath(name)
    setAlgo(name); setPath(p); setShown(1)
    for (let i = 1; i < p.length; i++) {
      if (abortRef.current) { setBusy(false); return }
      setShown(i + 1)
      setLog(`${name}: 실린더 ${p[i - 1]} → ${p[i]} 이동 (${Math.abs(p[i] - p[i - 1])})`)
      await sleep(520)
    }
    setLog(`${name} 완료 — 헤드 총 이동 거리 ${totalMovement(p)}`)
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setPath(null); setShown(0); setAlgo(null); setBusy(false); setLog('초기화됨') }, 50)
  }

  const H = path ? PAD + path.length * ROW : 120
  const moveSoFar = path ? totalMovement(path.slice(0, shown)) : 0

  return (
    <div className="viz">
      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        {/* 실린더 축 */}
        <line x1={PAD} y1={26} x2={W - PAD} y2={26} stroke="#334155" strokeWidth="1.5" />
        {[0, 50, 100, 150, 199].map(c => (
          <g key={c}>
            <line x1={x(c)} y1={22} x2={x(c)} y2={30} stroke="#475569" strokeWidth="1" />
            <text x={x(c)} y={16} textAnchor="middle" fontSize="9" fill="#64748b">{c}</text>
          </g>
        ))}
        {/* 요청 위치 표시 */}
        {REQUESTS.map((r, i) => (
          <circle key={i} cx={x(r)} cy={26} r="3" fill="#475569" />
        ))}
        {/* 경로 */}
        {path && (
          <polyline
            points={path.slice(0, shown).map((p, i) => `${x(p)},${40 + i * ROW}`).join(' ')}
            fill="none" stroke={color} strokeWidth="2" />
        )}
        {path && path.slice(0, shown).map((p, i) => (
          <g key={i}>
            <circle cx={x(p)} cy={40 + i * ROW} r="4.5"
              fill={i === shown - 1 ? color : '#1e293b'} stroke={color} strokeWidth="1.8" />
            <text x={x(p) + (x(p) > W / 2 ? -12 : 12)} y={40 + i * ROW + 4}
              textAnchor={x(p) > W / 2 ? 'end' : 'start'} fontSize="10"
              fill={i === 0 ? '#94a3b8' : '#cbd5e1'} fontWeight={i === shown - 1 ? 700 : 400}>
              {p}{i === 0 ? ' (헤드)' : ''}
            </text>
          </g>
        ))}
      </svg>

      {path && (
        <div style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
          헤드 총 이동 거리 <b style={{ color, fontSize: 17 }}>{moveSoFar}</b>
        </div>
      )}

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={() => run('FCFS')}>FCFS</button>
          <button className="viz-btn" style={{ '--c': '#10b981' }} disabled={busy} onClick={() => run('SSTF')}>SSTF</button>
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} disabled={busy} onClick={() => run('SCAN')}>SCAN</button>
          <button className="viz-btn" style={{ '--c': '#ec4899' }} disabled={busy} onClick={() => run('C-SCAN')}>C-SCAN</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
        <p className="viz-hint">같은 요청 큐로 알고리즘별 총 이동 거리를 비교해보세요 (FCFS는 보통 가장 큼).</p>
      </div>
    </div>
  )
}
