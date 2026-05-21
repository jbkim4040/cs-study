import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const NODES = [
  { name: '발신지', ico: '💻' },
  { name: 'R1', ico: '🔀' },
  { name: 'R2', ico: '🔀' },
  { name: '목적지', ico: '🖥️' },
]
const posLeft = i => `${5 + (i / 3) * 90}%`
const KIND_COLOR = { data: '#0ea5e9', reply: '#10b981', icmp: '#f43f5e' }

export default function ICMPViz({ color }) {
  const [pkt, setPkt] = useState(null)        // { pos, label, kind, ttl }
  const [destDown, setDestDown] = useState(false)
  const [badNode, setBadNode] = useState(-1)
  const [log, setLog] = useState('시나리오를 선택하면 ICMP 메시지가 어떻게 동작하는지 보여줍니다.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  const stop = () => abortRef.current

  async function runPing() {
    setBusy(true); abortRef.current = false
    setDestDown(false); setBadNode(-1)
    setPkt({ pos: 0, label: 'Echo 요청 (Type 8)', kind: 'data' })
    setLog('ping — 목적지에 에코 요청을 보냅니다.')
    await sleep(300)
    for (let p = 1; p <= 3; p++) {
      if (stop()) return setBusy(false)
      setPkt({ pos: p, label: 'Echo 요청 (Type 8)', kind: 'data' })
      await sleep(620)
    }
    setLog('목적지가 에코 요청을 받았습니다 — 에코 응답을 되돌려 보냅니다.')
    await sleep(450)
    for (let p = 3; p >= 0; p--) {
      if (stop()) return setBusy(false)
      setPkt({ pos: p, label: 'Echo 응답 (Type 0)', kind: 'reply' })
      await sleep(620)
    }
    setLog('✅ Echo 응답 수신 — 목적지가 살아 있고 도달 가능합니다 (ping 성공).')
    setBusy(false)
  }

  async function runTTL() {
    setBusy(true); abortRef.current = false
    setDestDown(false); setBadNode(-1)
    setPkt({ pos: 0, label: 'IP 패킷', kind: 'data', ttl: 2 })
    setLog('TTL이 2인 패킷을 전송합니다 — 라우터를 지날 때마다 1씩 줄어듭니다.')
    await sleep(380)
    if (stop()) return setBusy(false)
    setPkt({ pos: 1, label: 'IP 패킷', kind: 'data', ttl: 1 })
    setLog('R1 통과 — TTL 2 → 1')
    await sleep(680)
    if (stop()) return setBusy(false)
    setPkt({ pos: 2, label: 'IP 패킷', kind: 'data', ttl: 0 })
    setBadNode(2)
    setLog('R2 도착 — TTL 1 → 0 이 되어 패킷이 폐기됩니다.')
    await sleep(720)
    if (stop()) return setBusy(false)
    setLog('⚠ R2가 시간 경과(Time Exceeded) 메시지를 발신지로 되돌려 보냅니다.')
    for (let p = 2; p >= 0; p--) {
      if (stop()) return setBusy(false)
      setPkt({ pos: p, label: '⚠ 시간 경과 (Type 11)', kind: 'icmp' })
      await sleep(620)
    }
    setLog('⚠ 시간 경과 — TTL이 0이 되어 R2에서 폐기되었고, ICMP가 이를 발신지에 보고했습니다.')
    setBusy(false)
  }

  async function runUnreach() {
    setBusy(true); abortRef.current = false
    setDestDown(true); setBadNode(-1)
    setPkt({ pos: 0, label: 'IP 패킷', kind: 'data' })
    setLog('목적지 호스트가 다운된 상태에서 패킷을 전송합니다.')
    await sleep(360)
    for (let p = 1; p <= 2; p++) {
      if (stop()) return setBusy(false)
      setPkt({ pos: p, label: 'IP 패킷', kind: 'data' })
      await sleep(640)
    }
    if (stop()) return setBusy(false)
    setBadNode(2)
    setLog('R2 도착 — 목적지 호스트에 데이터그램을 배달할 수 없습니다.')
    await sleep(700)
    setLog('⚠ R2가 목적지 도달 불가(Destination Unreachable) 메시지를 생성합니다.')
    for (let p = 2; p >= 0; p--) {
      if (stop()) return setBusy(false)
      setPkt({ pos: p, label: '⚠ 목적지 도달 불가 (Type 3)', kind: 'icmp' })
      await sleep(620)
    }
    setLog('⚠ 목적지 도달 불가 — R2가 ICMP 오류 메시지를 발신지로 보고했습니다.')
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setPkt(null); setDestDown(false); setBadNode(-1); setBusy(false)
      setLog('초기화됨 — 시나리오 버튼을 눌러 다시 시작하세요.')
    }, 60)
  }

  const pc = pkt ? KIND_COLOR[pkt.kind] : color

  return (
    <div className="viz">
      <div className="net-stage">
        <div style={{ position: 'relative', height: 132 }}>
          <div style={{ position: 'absolute', top: 32, left: '5%', right: '5%', height: 3, background: '#334155' }} />
          {NODES.map((n, i) => {
            const bad = badNode === i
            const down = i === 3 && destDown
            return (
              <div
                key={i}
                className={'net-node' + (bad || down ? ' active' : '')}
                style={{
                  position: 'absolute', left: posLeft(i), top: 0, transform: 'translateX(-50%)',
                  '--c': bad || down ? '#f43f5e' : color,
                  opacity: down ? 0.55 : 1,
                }}
              >
                <span className="net-node-ico">{down ? '💢' : n.ico}</span>
                <span className="net-node-name">{n.name}</span>
                <span className="net-state">{down ? 'DOWN' : bad ? 'ERROR' : 'OK'}</span>
              </div>
            )
          })}
          {pkt && (
            <div style={{
              position: 'absolute', top: 88, left: posLeft(pkt.pos), transform: 'translateX(-50%)',
              transition: 'left .58s ease', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2, whiteSpace: 'nowrap',
              padding: '5px 12px', borderRadius: 8, background: '#0f172a',
              border: `1.5px solid ${pc}`, color: pc, fontSize: 11, fontWeight: 700,
              boxShadow: `0 0 12px -3px ${pc}`,
            }}>
              <span>{pkt.label}</span>
              {pkt.ttl != null && (
                <span style={{ fontSize: 9.5, fontFamily: 'ui-monospace, monospace', color: '#94a3b8' }}>
                  TTL = {pkt.ttl}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={runPing}>에코 요청 (ping)</button>
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} disabled={busy} onClick={runTTL}>TTL 소진 → 시간 경과</button>
          <button className="viz-btn" style={{ '--c': '#f43f5e' }} disabled={busy} onClick={runUnreach}>목적지 도달 불가</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
