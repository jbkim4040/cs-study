import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function ThreadViz({ color }) {
  const [count, setCount] = useState(2)
  const [running, setRunning] = useState(-1)
  const [log, setLog] = useState('스레드 수를 조절하고 ▶ 실행을 눌러보세요. 모든 스레드는 코드·데이터·힙을 공유합니다.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function run() {
    setBusy(true); abortRef.current = false
    for (let round = 0; round < 3; round++) {
      for (let i = 0; i < count; i++) {
        if (abortRef.current) { setBusy(false); setRunning(-1); return }
        setRunning(i)
        setLog(`스레드 T${i} 실행 중 — 스레드들이 CPU를 번갈아 점유합니다 (동시성).`)
        await sleep(480)
      }
    }
    setRunning(-1)
    setLog('모든 스레드가 작업 완료. 스택·PC는 각자, 코드·데이터·힙은 함께 공유했습니다.')
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setRunning(-1); setBusy(false); setCount(2); setLog('초기화됨') }, 50)
  }

  const threads = Array.from({ length: count })

  return (
    <div className="viz">
      <div style={{ border: `2px solid ${color}55`, borderRadius: 12, padding: 14, background: '#0b1220' }}>
        <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
          프로세스 — 스레드 {count}개
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['코드 (텍스트)', '데이터', '힙'].map(s => (
            <div key={s} style={{
              flex: 1, padding: '9px 4px', textAlign: 'center', borderRadius: 8,
              background: '#1e293b', border: '1.5px solid #334155', fontSize: 12, color: '#cbd5e1', fontWeight: 600,
            }}>
              {s}<div style={{ fontSize: 9, color: '#22d3ee', marginTop: 3 }}>● 공유</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {threads.map((_, i) => {
            const on = running === i
            return (
              <div key={i} style={{
                flex: 1, padding: '10px 4px', textAlign: 'center', borderRadius: 8,
                background: on ? color + '33' : '#1e293b',
                border: `1.5px solid ${on ? color : '#334155'}`,
                transition: 'background .15s, border-color .15s',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: on ? color : '#e2e8f0' }}>🧵 T{i}</div>
                <div style={{ fontSize: 9, color: '#64748b', marginTop: 3 }}>스택 · 레지스터 · PC</div>
                <div style={{ fontSize: 9, color: on ? color : '#475569', marginTop: 2, fontWeight: 600 }}>
                  {on ? '실행 중' : '대기'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': '#10b981' }} disabled={busy || count >= 4} onClick={() => setCount(c => Math.min(4, c + 1))}>스레드 추가 +</button>
          <button className="viz-btn" style={{ '--c': '#ef4444' }} disabled={busy || count <= 1} onClick={() => setCount(c => Math.max(1, c - 1))}>스레드 제거 −</button>
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={run}>▶ 실행</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
        <p className="viz-hint">스레드를 늘려도 코드·데이터·힙은 그대로 공유 — 그래서 생성·통신 비용이 저렴합니다.</p>
      </div>
    </div>
  )
}
