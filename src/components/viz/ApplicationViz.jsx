import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const ROWS = [10, 67, 124]
const PHASE_LABEL = {
  idle: '대기', req: '요청 전송 ▶', wait: '큐에서 대기',
  proc: '서버 처리 중', res: '◀ 응답 수신', done: '완료 ✓',
}

export default function ApplicationViz({ color }) {
  const [phases, setPhases] = useState(['idle', 'idle', 'idle'])
  const [pkts, setPkts] = useState([null, null, null])
  const [server, setServer] = useState('대기 중')
  const [serving, setServing] = useState(false)
  const [log, setLog] = useState('서버 유형을 선택하면 요청·응답 처리 방식을 비교해 보여줍니다.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  const stop = () => abortRef.current
  const setPhase = (i, v) => setPhases(p => p.map((x, k) => (k === i ? v : x)))
  const setPkt = (i, v) => setPkts(p => p.map((x, k) => (k === i ? v : x)))

  async function sendAll() {
    setPhases(['req', 'req', 'req'])
    setPkts([0, 1, 2].map(() => ({ dir: 'req', at: 'start' })))
    await sleep(70)
    setPkts([0, 1, 2].map(() => ({ dir: 'req', at: 'end' })))
    await sleep(820)
  }

  async function runIterative() {
    setBusy(true); abortRef.current = false
    setPhases(['idle', 'idle', 'idle']); setPkts([null, null, null])
    setServer('대기 중'); setServing(false)
    setLog('반복적 서버 — 세 클라이언트가 요청을 보냅니다.')
    await sleep(350)
    if (stop()) return setBusy(false)
    await sendAll()
    if (stop()) return setBusy(false)
    setPkts([null, null, null]); setPhases(['wait', 'wait', 'wait'])
    setLog('요청들이 서버에 도착 — 반복적 서버는 한 번에 하나씩만 처리합니다.')
    await sleep(650)
    for (let i = 0; i < 3; i++) {
      if (stop()) return setBusy(false)
      setServing(true)
      setServer(`처리 중 — 요청 ${i + 1} / 3`)
      setPhase(i, 'proc')
      setLog(`요청 ${i + 1}을 처리하는 동안 나머지 클라이언트는 큐에서 대기합니다.`)
      await sleep(820)
      if (stop()) return setBusy(false)
      setServing(false)
      setPhase(i, 'res')
      setPkt(i, { dir: 'res', at: 'start' })
      await sleep(70)
      setPkt(i, { dir: 'res', at: 'end' })
      await sleep(720)
      setPkt(i, null); setPhase(i, 'done')
    }
    setServer('대기 중')
    setLog('완료 — 반복적 서버는 단순하지만 요청을 순차적으로만 처리합니다 (주로 UDP).')
    setBusy(false)
  }

  async function runConcurrent() {
    setBusy(true); abortRef.current = false
    setPhases(['idle', 'idle', 'idle']); setPkts([null, null, null])
    setServer('대기 중'); setServing(false)
    setLog('동시적 서버 — 세 클라이언트가 요청을 보냅니다.')
    await sleep(350)
    if (stop()) return setBusy(false)
    await sendAll()
    if (stop()) return setBusy(false)
    setPkts([null, null, null]); setPhases(['proc', 'proc', 'proc'])
    setServing(true)
    setServer('처리 중 ×3 — 자식 서버')
    setLog('동시적 서버는 자식 서버를 만들어 세 요청을 동시에 처리합니다.')
    await sleep(1000)
    if (stop()) return setBusy(false)
    setServing(false)
    setPhases(['res', 'res', 'res'])
    setPkts([0, 1, 2].map(() => ({ dir: 'res', at: 'start' })))
    await sleep(70)
    setPkts([0, 1, 2].map(() => ({ dir: 'res', at: 'end' })))
    await sleep(780)
    if (stop()) return setBusy(false)
    setPkts([null, null, null]); setPhases(['done', 'done', 'done'])
    setServer('대기 중')
    setLog('완료 — 동시적 서버는 여러 요청을 병행 처리해 대기 시간이 짧습니다 (주로 TCP).')
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setPhases(['idle', 'idle', 'idle']); setPkts([null, null, null])
      setServer('대기 중'); setServing(false); setBusy(false)
      setLog('초기화됨 — 서버 유형 버튼을 눌러 다시 시작하세요.')
    }, 60)
  }

  return (
    <div className="viz">
      <div className="net-stage">
        <div style={{ position: 'relative', height: 172 }}>
          {/* 클라이언트 */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', left: 0, top: ROWS[i], width: '24%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              padding: '5px 4px', background: '#1e293b', borderRadius: 8,
              border: `1.5px solid ${phases[i] === 'done' ? '#10b981' : phases[i] === 'idle' ? '#334155' : color}`,
              transition: 'border-color .3s ease',
            }}>
              <span style={{ fontSize: 15 }}>💻</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>클라이언트 {i + 1}</span>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                background: '#0f172a',
                color: phases[i] === 'done' ? '#10b981' : phases[i] === 'idle' ? '#64748b' : color,
              }}>{PHASE_LABEL[phases[i]]}</span>
            </div>
          ))}

          {/* 서버 */}
          <div className={'net-node' + (serving ? ' active' : '')} style={{
            position: 'absolute', right: 0, top: 26, width: '26%', height: 120,
            justifyContent: 'center', '--c': serving ? '#f59e0b' : color,
          }}>
            <span className="net-node-ico" style={serving ? { animation: 'net-spin 1s linear infinite' } : null}>
              {serving ? '⚙️' : '🖥️'}
            </span>
            <span className="net-node-name">서버</span>
            <span className="net-state" style={{ textAlign: 'center' }}>{server}</span>
          </div>

          {/* 패킷 */}
          {pkts.map((p, i) => p && (
            <div key={i} style={{
              position: 'absolute', top: ROWS[i] + 13,
              left: p.dir === 'req'
                ? (p.at === 'start' ? '27%' : '70%')
                : (p.at === 'start' ? '70%' : '27%'),
              transform: 'translateX(-50%)', transition: 'left .72s ease',
              padding: '3px 9px', borderRadius: 6, background: '#0f172a',
              fontSize: 9.5, fontWeight: 800, whiteSpace: 'nowrap',
              border: `1.5px solid ${p.dir === 'req' ? color : '#10b981'}`,
              color: p.dir === 'req' ? color : '#10b981',
              boxShadow: `0 0 10px -3px ${p.dir === 'req' ? color : '#10b981'}`,
            }}>
              {p.dir === 'req' ? '요청 ▶' : '◀ 응답'}
            </div>
          ))}
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={runIterative}>
            반복적 서버 (UDP)
          </button>
          <button className="viz-btn" style={{ '--c': '#10b981' }} disabled={busy} onClick={runConcurrent}>
            동시적 서버 (TCP)
          </button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
