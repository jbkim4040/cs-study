import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const ROWS = [22, 86, 150]               // 패킷 세로 중심
const MID = 86
const PROCS = [
  { ico: '🌐', cli: '웹 브라우저', src: 50001, dst: 80,    srv: '웹 서버',  color: '#6366f1' },
  { ico: '✉️', cli: '메일 클라이언트', src: 50002, dst: 25, srv: '메일 서버', color: '#f59e0b' },
  { ico: '🎮', cli: '게임 앱',     src: 50003, dst: 27015, srv: '게임 서버', color: '#10b981' },
]

export default function TransportViz({ color }) {
  const [pkts, setPkts] = useState([])     // { id, x, y, color, dst }
  const [stage, setStage] = useState('idle')
  const [log, setLog] = useState('세 개의 앱이 하나의 전송 계층을 공유합니다. 버튼을 눌러 보세요.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function run() {
    setBusy(true); abortRef.current = false
    setStage('idle')
    setPkts(PROCS.map((p, i) => ({ id: i, x: '7%', y: ROWS[i], color: p.color, dst: p.dst })))
    setLog('① 세 응용 프로세스가 각자 보낼 메시지를 전송 계층에 내려보냅니다.')
    await sleep(900)
    if (abortRef.current) return setBusy(false)

    setStage('mux')
    setPkts(prev => prev.map(p => ({ ...p, x: '31%', y: MID })))
    setLog('② 다중화(Multiplexing) — 전송 계층이 세 메시지를 하나의 흐름으로 모읍니다.')
    await sleep(1100)
    if (abortRef.current) return setBusy(false)

    setStage('wire')
    setPkts(prev => prev.map((p, i) => ({ ...p, x: `${50 + i * 5}%` })))
    setLog('③ 하나의 네트워크 연결을 통해 패킷들이 함께 전달됩니다.')
    await sleep(1000)
    if (abortRef.current) return setBusy(false)

    setStage('demux')
    setPkts(prev => prev.map(p => ({ ...p, x: '69%', y: MID })))
    setLog('④ 역다중화(Demultiplexing) — 수신 측이 목적지 포트 번호로 패킷을 분류합니다.')
    await sleep(1000)
    if (abortRef.current) return setBusy(false)

    setStage('done')
    setPkts(prev => prev.map((p, i) => ({ ...p, x: '93%', y: ROWS[i] })))
    setLog('⑤ 포트 번호에 따라 각 패킷이 올바른 서버 프로세스에 도착했습니다.')
    await sleep(900)
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setPkts([]); setStage('idle'); setBusy(false)
      setLog('초기화됨 — 버튼을 눌러 다시 시작하세요.')
    }, 60)
  }

  const boxOn = name => (stage === name ? ' active' : '')

  return (
    <div className="viz">
      <div className="net-stage">
        <div style={{ position: 'relative', height: 188 }}>
          {/* 클라이언트 프로세스 */}
          {PROCS.map((p, i) => (
            <div key={'c' + i} style={{
              position: 'absolute', left: 0, top: ROWS[i] - 21, width: '20%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              padding: '5px 4px', background: '#1e293b', borderRadius: 8,
              border: `1.5px solid ${p.color}`,
            }}>
              <span style={{ fontSize: 16 }}>{p.ico}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{p.cli}</span>
              <span style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', color: '#94a3b8' }}>:{p.src}</span>
            </div>
          ))}

          {/* 다중화 */}
          <div className={'net-node' + boxOn('mux')} style={{
            position: 'absolute', left: '31%', top: 28, transform: 'translateX(-50%)',
            width: '17%', height: 132, justifyContent: 'center', '--c': color,
          }}>
            <span className="net-node-ico">🔀</span>
            <span className="net-node-name" style={{ textAlign: 'center' }}>전송 계층<br />다중화</span>
          </div>

          {/* 역다중화 */}
          <div className={'net-node' + boxOn('demux')} style={{
            position: 'absolute', left: '69%', top: 28, transform: 'translateX(-50%)',
            width: '17%', height: 132, justifyContent: 'center', '--c': '#10b981',
          }}>
            <span className="net-node-ico">🔁</span>
            <span className="net-node-name" style={{ textAlign: 'center' }}>전송 계층<br />역다중화</span>
          </div>

          {/* 서버 프로세스 */}
          {PROCS.map((p, i) => (
            <div key={'s' + i} style={{
              position: 'absolute', right: 0, top: ROWS[i] - 21, width: '20%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              padding: '5px 4px', background: '#1e293b', borderRadius: 8,
              border: `1.5px solid ${stage === 'done' ? p.color : '#334155'}`,
              opacity: stage === 'done' ? 1 : 0.55, transition: 'all .4s ease',
            }}>
              <span style={{ fontSize: 16 }}>🖥️</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{p.srv}</span>
              <span style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', color: '#94a3b8' }}>:{p.dst}</span>
            </div>
          ))}

          {/* 패킷 */}
          {pkts.map(p => (
            <div key={p.id} style={{
              position: 'absolute', left: p.x, top: p.y - 13, transform: 'translateX(-50%)',
              transition: 'left .85s ease, top .85s ease',
              padding: '3px 8px', borderRadius: 6, background: '#0f172a',
              border: `1.5px solid ${p.color}`, color: p.color,
              fontSize: 9.5, fontWeight: 800, whiteSpace: 'nowrap',
              boxShadow: `0 0 10px -3px ${p.color}`,
            }}>
              :{p.dst}
            </div>
          ))}
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={run}>
            다중화 · 역다중화 실행
          </button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
