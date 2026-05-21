import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const PAGE_SIZE = 16
const PAGE_TABLE = [5, 2, 7, 1, 4, 0, 6, 3] // page → frame

export default function PagingViz({ color }) {
  const [addr, setAddr] = useState('38')
  const [step, setStep] = useState(0)
  const [calc, setCalc] = useState(null)
  const [log, setLog] = useState('논리 주소(0~127)를 입력하고 주소 변환을 실행해보세요. 페이지 크기 = 16.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function translate() {
    const a = parseInt(addr)
    if (isNaN(a) || a < 0 || a > 127) { setLog('⚠️ 논리 주소는 0~127 사이여야 합니다.'); return }
    setBusy(true); abortRef.current = false
    const page = a >> 4, offset = a & 15
    const frame = PAGE_TABLE[page]
    const phys = frame * PAGE_SIZE + offset
    setCalc({ a, page, offset, frame, phys })
    setStep(1)
    setLog(`① 논리 주소 ${a} = 페이지 번호 ${page} × 16 + 오프셋 ${offset}`)
    await sleep(950); if (abortRef.current) { setBusy(false); return }
    setStep(2)
    setLog(`② 페이지 테이블 조회 → 페이지 ${page}는 프레임 ${frame}에 적재됨`)
    await sleep(950); if (abortRef.current) { setBusy(false); return }
    setStep(3)
    setLog(`③ 물리 주소 = 프레임 ${frame} × 16 + 오프셋 ${offset} = ${phys}`)
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setStep(0); setCalc(null); setBusy(false); setLog('초기화됨') }, 50)
  }

  const box = (label, value, on) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>{label}</div>
      <div style={{
        minWidth: 54, padding: '8px 12px', borderRadius: 8, fontSize: 18, fontWeight: 800,
        background: on ? color + '33' : '#1e293b', border: `1.5px solid ${on ? color : '#334155'}`,
        color: on ? color : '#e2e8f0',
      }}>{value}</div>
    </div>
  )

  return (
    <div className="viz">
      {/* 논리 주소 */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }}>
        {box('논리 주소', calc ? calc.a : addr, false)}
        <span style={{ color: '#64748b', paddingBottom: 8 }}>=</span>
        {box('페이지 번호 p', calc && step >= 1 ? calc.page : '?', step >= 1)}
        {box('오프셋 d', calc && step >= 1 ? calc.offset : '?', step >= 1)}
      </div>

      {/* 페이지 테이블 */}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5, textAlign: 'center' }}>페이지 테이블</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 3 }}>
            {PAGE_TABLE.map((f, p) => {
              const on = calc && step >= 2 && calc.page === p
              return (
                <div key={p} style={{
                  width: 38, padding: '5px 0', textAlign: 'center', borderRadius: 6,
                  background: on ? color + '33' : '#1e293b',
                  border: `1.5px solid ${on ? color : '#334155'}`,
                }}>
                  <div style={{ fontSize: 9, color: '#64748b' }}>p{p}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: on ? color : '#e2e8f0' }}>f{f}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 물리 주소 */}
      {calc && step >= 3 && (
        <div style={{
          textAlign: 'center', padding: 12, borderRadius: 10,
          background: color + '1a', border: `1.5px solid ${color}`, animation: 'fade-in .25s ease',
        }}>
          <span style={{ color: '#94a3b8', fontSize: 13 }}>물리 주소 = </span>
          <span style={{ color: '#e2e8f0', fontSize: 13 }}>프레임 {calc.frame} × 16 + {calc.offset} = </span>
          <span style={{ color, fontSize: 22, fontWeight: 800 }}>{calc.phys}</span>
        </div>
      )}

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-inputs">
          <label>논리 주소 <input type="number" value={addr} onChange={e => setAddr(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={translate}>주소 변환 ▶</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
