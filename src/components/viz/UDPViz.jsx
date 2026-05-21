import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const TOTAL = 6

export default function UDPViz({ color }) {
  const [active, setActive] = useState(null)   // { id, lost, phase }
  const [history, setHistory] = useState([])
  const [sent, setSent] = useState(0)
  const [arrived, setArrived] = useState(0)
  const [log, setLog] = useState('UDP는 연결 없이 데이터그램을 던지고 잊습니다. 전송 버튼을 눌러 보세요.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function send() {
    setBusy(true); abortRef.current = false
    setHistory([]); setSent(0); setArrived(0); setActive(null)
    await sleep(250)
    for (let i = 1; i <= TOTAL; i++) {
      if (abortRef.current) { setBusy(false); return }
      const lost = Math.random() < 0.3
      setSent(i)
      setActive({ id: i, lost, phase: 'start' })
      await sleep(70)
      setActive({ id: i, lost, phase: 'fly' })
      setLog(`데이터그램 #${i} 전송 — 확인응답을 기다리지 않습니다.`)
      await sleep(lost ? 520 : 780)
      if (abortRef.current) { setBusy(false); return }
      if (lost) {
        setActive({ id: i, lost, phase: 'lost' })
        setLog(`데이터그램 #${i} 손실 ✗ — UDP는 재전송하지 않고 그대로 잊습니다.`)
        await sleep(440)
      } else {
        setArrived(a => a + 1)
        setLog(`데이터그램 #${i} 도착 ✓ — ACK 없이 바로 다음으로 넘어갑니다.`)
      }
      setHistory(h => [...h, { id: i, lost }])
      setActive(null)
      await sleep(280)
    }
    setLog('전송 완료 — UDP는 손실을 알리지도, 재전송하지도 않습니다 (fire-and-forget).')
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setActive(null); setHistory([]); setSent(0); setArrived(0); setBusy(false)
      setLog('초기화됨 — 전송 버튼을 눌러 다시 시작하세요.')
    }, 60)
  }

  const lost = sent - arrived
  const pktLeft = !active ? '14%'
    : active.phase === 'start' ? '14%'
    : active.lost ? '50%' : '86%'

  return (
    <div className="viz">
      <div className="net-stage">
        <div className="net-head">
          <div className="net-node" style={{ '--c': color }}>
            <span className="net-node-ico">💻</span>
            <span className="net-node-name">송신 호스트</span>
            <span className="net-state">전송 {sent}</span>
          </div>
          <div className="net-node" style={{ '--c': '#10b981' }}>
            <span className="net-node-ico">🖥️</span>
            <span className="net-node-name">수신 호스트</span>
            <span className="net-state">도착 {arrived}</span>
          </div>
        </div>

        <div style={{ position: 'relative', height: 58 }}>
          <div style={{ position: 'absolute', top: 28, left: '12%', right: '12%', height: 2, background: '#334155' }} />
          {active && (
            <div style={{
              position: 'absolute', top: 9, left: pktLeft, transform: 'translateX(-50%)',
              transition: 'left .72s ease, opacity .4s ease',
              opacity: active.phase === 'lost' ? 0 : 1,
              padding: '5px 12px', borderRadius: 8, whiteSpace: 'nowrap',
              background: '#0f172a', fontSize: 11, fontWeight: 700,
              border: `1.5px solid ${active.lost && active.phase !== 'start' ? '#f43f5e' : color}`,
              color: active.lost && active.phase !== 'start' ? '#f43f5e' : color,
              boxShadow: `0 0 12px -3px ${active.lost && active.phase !== 'start' ? '#f43f5e' : color}`,
            }}>
              📦 데이터그램 #{active.id}
            </div>
          )}
          {active && active.phase === 'lost' && (
            <div style={{
              position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
              fontSize: 18, animation: 'net-fade .3s ease',
            }}>💥</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', minHeight: 26 }}>
          {history.map(h => (
            <span key={h.id} style={{
              padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700,
              background: '#1e293b',
              border: `1px solid ${h.lost ? '#f43f5e' : '#10b981'}`,
              color: h.lost ? '#f43f5e' : '#10b981',
            }}>
              #{h.id} {h.lost ? '✗ 손실' : '✓ 도착'}
            </span>
          ))}
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      {sent > 0 && (
        <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
          전송 <b style={{ color }}>{sent}</b> · 도착 <b style={{ color: '#10b981' }}>{arrived}</b> · 손실 <b style={{ color: '#f43f5e' }}>{lost}</b>
          <span style={{ color: '#64748b' }}> — 송신 측은 손실 여부를 전혀 알지 못합니다</span>
        </div>
      )}

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={send}>
            데이터그램 {TOTAL}개 전송
          </button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
