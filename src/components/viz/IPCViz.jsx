import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const METHODS = {
  pipe: { label: '파이프', sub: 'Pipe', loc: '커널 영역', locColor: '#3b82f6', sync: 'OS가 동기화 처리', note: '부모-자식 프로세스 간 단방향 통신' },
  mq:   { label: '메시지 큐', sub: 'Message Queue', loc: '커널 영역', locColor: '#3b82f6', sync: 'OS가 동기화 처리', note: '메시지 단위 송수신 · 타입 존재' },
  shm:  { label: '공유 메모리', sub: 'Shared Memory', loc: '사용자 영역', locColor: '#f59e0b', sync: '프로그램이 직접 동기화', note: '가장 빠름 — 임계 구역 발생' },
}

export default function IPCViz({ color }) {
  const [method, setMethod] = useState('pipe')
  const [channel, setChannel] = useState([])
  const [moving, setMoving] = useState(null) // 'send' | 'recv'
  const [movingLabel, setMovingLabel] = useState('')
  const [log, setLog] = useState('IPC 기법을 고르고 메시지를 전송·수신해보세요.')
  const [busy, setBusy] = useState(false)
  const idRef = useRef(1)
  const m = METHODS[method]

  function pick(name) {
    if (busy) return
    setMethod(name)
    setChannel([])
    setLog(`${METHODS[name].label}: ${METHODS[name].note}`)
  }

  async function send() {
    setBusy(true)
    const label = 'M' + idRef.current++
    setMovingLabel(label)
    setMoving('send')
    setLog(`송신 프로세스 → ${m.label}: "${label}" 쓰기 (write / send)`)
    await sleep(750)
    setMoving(null)
    setChannel(c => [...c, label])
    setBusy(false)
  }

  async function recv() {
    if (!channel.length) { setLog('⚠️ 채널이 비어 있습니다 — 먼저 전송하세요.'); return }
    setBusy(true)
    const label = channel[0]
    setChannel(c => c.slice(1))
    setMovingLabel(label)
    setMoving('recv')
    setLog(`${m.label} → 수신 프로세스: "${label}" 읽기 (read / receive)`)
    await sleep(750)
    setMoving(null)
    setBusy(false)
  }

  function reset() {
    setChannel([]); setMoving(null); setBusy(false); idRef.current = 1
    setLog('초기화됨')
  }

  const Packet = ({ label }) => (
    <div style={{
      padding: '4px 9px', borderRadius: 7, background: color, color: '#fff',
      fontSize: 11, fontWeight: 700, animation: 'fade-in 0.2s ease', whiteSpace: 'nowrap',
    }}>✉ {label}</div>
  )

  return (
    <div className="viz">
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 6 }}>
        <div style={{ flex: 1, padding: '14px 8px', borderRadius: 10, background: '#1e293b', border: '1.5px solid #334155', textAlign: 'center' }}>
          <div style={{ fontSize: 22 }}>🟦</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginTop: 4 }}>송신 프로세스</div>
          <div style={{ fontSize: 9, color: '#64748b' }}>Sender</div>
        </div>
        <div style={{ width: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {moving === 'send' ? <Packet label={movingLabel} /> : <span style={{ color: '#475569' }}>▶</span>}
        </div>
        <div style={{
          flex: 1.4, padding: '10px 8px', borderRadius: 10,
          background: `color-mix(in srgb, ${color} 14%, #0f172a)`,
          border: `1.5px solid ${color}`, textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color }}>{m.label}</div>
          <div style={{ fontSize: 9, color: '#64748b', marginBottom: 5 }}>{m.sub}</div>
          <div style={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', minHeight: 24 }}>
            {channel.length === 0
              ? <span style={{ fontSize: 10, color: '#475569' }}>(비어 있음)</span>
              : channel.map((l, i) => (
                  <span key={i} style={{
                    padding: '2px 6px', borderRadius: 5, fontSize: 10, fontWeight: 700,
                    background: color + '33', color: '#e2e8f0', border: `1px solid ${color}`,
                  }}>{l}</span>
                ))}
          </div>
          <div style={{ fontSize: 9, color: m.locColor, marginTop: 5, fontWeight: 700 }}>📍 {m.loc}</div>
        </div>
        <div style={{ width: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {moving === 'recv' ? <Packet label={movingLabel} /> : <span style={{ color: '#475569' }}>▶</span>}
        </div>
        <div style={{ flex: 1, padding: '14px 8px', borderRadius: 10, background: '#1e293b', border: '1.5px solid #334155', textAlign: 'center' }}>
          <div style={{ fontSize: 22 }}>🟩</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginTop: 4 }}>수신 프로세스</div>
          <div style={{ fontSize: 9, color: '#64748b' }}>Receiver</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', fontSize: 11 }}>
        <span style={{ padding: '3px 9px', borderRadius: 6, background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }}>
          동기화: <b style={{ color: m.sync.startsWith('OS') ? '#4ade80' : '#fca5a5' }}>{m.sync}</b>
        </span>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>IPC 기법:</div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': method === 'pipe' ? color : '#64748b' }} disabled={busy} onClick={() => pick('pipe')}>파이프</button>
          <button className="viz-btn" style={{ '--c': method === 'mq' ? color : '#64748b' }} disabled={busy} onClick={() => pick('mq')}>메시지 큐</button>
          <button className="viz-btn" style={{ '--c': method === 'shm' ? color : '#64748b' }} disabled={busy} onClick={() => pick('shm')}>공유 메모리</button>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={send}>▶ 전송 (write)</button>
          <button className="viz-btn" style={{ '--c': '#10b981' }} disabled={busy} onClick={recv}>◀ 수신 (read)</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
