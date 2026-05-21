import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const SETUP = [
  { dir: 'r', flag: 'SYN',       info: 'seq=x',             cs: 'SYN_SENT',    ss: 'LISTEN',      log: '① 클라이언트 → 서버 : SYN — 연결을 요청합니다 (능동 개방)' },
  { dir: 'l', flag: 'SYN + ACK', info: 'seq=y, ack=x+1',    cs: 'SYN_SENT',    ss: 'SYN_RCVD',    log: '② 서버 → 클라이언트 : SYN+ACK — 요청을 수락합니다 (수동 개방)' },
  { dir: 'r', flag: 'ACK',       info: 'seq=x+1, ack=y+1',  cs: 'ESTABLISHED', ss: 'ESTABLISHED', log: '③ 클라이언트 → 서버 : ACK — 연결이 확립되었습니다 (ESTABLISHED)' },
]
const CLOSE = [
  { dir: 'r', flag: 'FIN', info: 'seq=u',   cs: 'FIN_WAIT',  ss: 'ESTABLISHED', log: '① 클라이언트 → 서버 : FIN — 연결 종료를 요청합니다' },
  { dir: 'l', flag: 'ACK', info: 'ack=u+1', cs: 'FIN_WAIT',  ss: 'CLOSE_WAIT',  log: '② 서버 → 클라이언트 : ACK — 종료 요청을 확인합니다' },
  { dir: 'l', flag: 'FIN', info: 'seq=v',   cs: 'TIME_WAIT', ss: 'LAST_ACK',    log: '③ 서버 → 클라이언트 : FIN — 서버도 종료를 요청합니다' },
  { dir: 'r', flag: 'ACK', info: 'ack=v+1', cs: 'CLOSED',    ss: 'CLOSED',      log: '④ 클라이언트 → 서버 : ACK — 연결 종료가 완료되었습니다' },
]
const FLAG_COLOR = { 'SYN': '#10b981', 'SYN + ACK': '#0ea5e9', 'ACK': '#38bdf8', 'FIN': '#f43f5e' }

export default function TCPViz({ color }) {
  const [msgs, setMsgs] = useState([])
  const [cState, setCState] = useState('CLOSED')
  const [sState, setSState] = useState('LISTEN')
  const [log, setLog] = useState('버튼을 눌러 TCP 연결의 3-way handshake를 직접 확인해 보세요.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function play(seq, kind) {
    setBusy(true); abortRef.current = false
    setMsgs([])
    setCState(kind === 'setup' ? 'CLOSED' : 'ESTABLISHED')
    setSState(kind === 'setup' ? 'LISTEN' : 'ESTABLISHED')
    await sleep(320)
    for (let i = 0; i < seq.length; i++) {
      if (abortRef.current) { setBusy(false); return }
      const m = seq[i]
      setMsgs(prev => [...prev, m])
      setLog(m.log)
      await sleep(440)
      if (abortRef.current) { setBusy(false); return }
      setCState(m.cs); setSState(m.ss)
      await sleep(640)
    }
    setLog(kind === 'setup'
      ? '✅ 연결 확립 완료 — 이제 양방향으로 데이터를 주고받을 수 있습니다.'
      : '✅ 연결 종료 완료 — 양쪽 모두 CLOSED 상태가 되었습니다.')
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setMsgs([]); setCState('CLOSED'); setSState('LISTEN'); setBusy(false)
      setLog('초기화됨 — 버튼을 눌러 다시 시작하세요.')
    }, 60)
  }

  return (
    <div className="viz">
      <div className="net-stage">
        <div className="net-head">
          <div className="net-node" style={{ '--c': color }}>
            <span className="net-node-ico">💻</span>
            <span className="net-node-name">클라이언트</span>
            <span className="net-state">{cState}</span>
          </div>
          <div className="net-node" style={{ '--c': color }}>
            <span className="net-node-ico">🖥️</span>
            <span className="net-node-name">서버</span>
            <span className="net-state">{sState}</span>
          </div>
        </div>

        <div className="net-track-area">
          {msgs.length === 0 && <div className="net-hint">아직 교환된 세그먼트가 없습니다</div>}
          {msgs.map((m, i) => (
            <div className="net-msg-row" key={i}>
              <span className="net-life" style={{ left: '15%' }} />
              <span className="net-life" style={{ left: '85%' }} />
              <div
                className={'net-pkt ' + (m.dir === 'r' ? 'fly-r' : 'fly-l')}
                style={{ '--fc': FLAG_COLOR[m.flag] || color }}
              >
                <span className="net-pkt-flag">
                  {m.dir === 'l' && '◄ '}{m.flag}{m.dir === 'r' && ' ►'}
                </span>
                <span className="net-pkt-info">{m.info}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={() => play(SETUP, 'setup')}>
            연결 설정 (3-way handshake)
          </button>
          <button className="viz-btn" style={{ '--c': '#f43f5e' }} disabled={busy} onClick={() => play(CLOSE, 'close')}>
            연결 종료 (4-way)
          </button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
