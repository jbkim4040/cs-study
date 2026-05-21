import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const SEG_TABLE = [
  { name: '코드',   base: 100, limit: 40 },
  { name: '데이터', base: 500, limit: 25 },
  { name: '스택',   base: 300, limit: 30 },
  { name: '힙',     base: 380, limit: 60 },
]
const MEM_MAX = 600

export default function SegmentationViz({ color }) {
  const [seg, setSeg] = useState('0')
  const [offset, setOffset] = useState('25')
  const [result, setResult] = useState(null)
  const [log, setLog] = useState('세그먼트 번호(0~3)와 오프셋을 입력해 주소 변환을 실행해보세요.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function translate() {
    const s = parseInt(seg), d = parseInt(offset)
    if (isNaN(s) || s < 0 || s > 3) { setLog('⚠️ 세그먼트 번호는 0~3'); return }
    if (isNaN(d) || d < 0) { setLog('⚠️ 오프셋은 0 이상'); return }
    setBusy(true); abortRef.current = false
    const e = SEG_TABLE[s]
    setResult({ s, d, base: e.base, limit: e.limit, ok: null })
    setLog(`① 세그먼트 ${s}(${e.name}) 선택 → 세그먼트 테이블에서 base=${e.base}, limit=${e.limit}`)
    await sleep(950); if (abortRef.current) { setBusy(false); return }
    if (d >= e.limit) {
      setResult({ s, d, base: e.base, limit: e.limit, ok: false })
      setLog(`② 한계 검사: 오프셋 ${d} ≥ limit ${e.limit} → ❌ 보호 위반 트랩 발생!`)
      setBusy(false)
      return
    }
    setResult({ s, d, base: e.base, limit: e.limit, ok: true, phys: e.base + d })
    setLog(`② 한계 검사 통과 (${d} < ${e.limit}) → ③ 물리 주소 = base ${e.base} + 오프셋 ${d} = ${e.base + d}`)
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setResult(null); setBusy(false); setLog('초기화됨') }, 50)
  }

  return (
    <div className="viz">
      {/* 세그먼트 테이블 */}
      <div>
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>세그먼트 테이블</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
          {SEG_TABLE.map((e, i) => {
            const on = result && result.s === i
            return (
              <div key={i} style={{
                padding: '7px 4px', textAlign: 'center', borderRadius: 8,
                background: on ? color + '33' : '#1e293b', border: `1.5px solid ${on ? color : '#334155'}`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: on ? color : '#e2e8f0' }}>{i} · {e.name}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>base {e.base}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>limit {e.limit}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 메모리 레이아웃 */}
      <div>
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>물리 메모리 (0 ~ {MEM_MAX})</div>
        <div style={{ position: 'relative', height: 38, background: '#1e293b', borderRadius: 8, border: '1.5px solid #334155' }}>
          {SEG_TABLE.map((e, i) => {
            const on = result && result.s === i
            return (
              <div key={i} style={{
                position: 'absolute', left: (e.base / MEM_MAX) * 100 + '%', width: (e.limit / MEM_MAX) * 100 + '%',
                top: 3, bottom: 3, borderRadius: 5,
                background: on ? color : color + '55',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#fff', overflow: 'hidden',
              }}>{e.name}</div>
            )
          })}
          {result && result.ok && (
            <div style={{
              position: 'absolute', left: (result.phys / MEM_MAX) * 100 + '%', top: -4, bottom: -4,
              width: 2, background: '#fff',
            }} />
          )}
        </div>
      </div>

      {result && result.ok != null && (
        <div style={{
          textAlign: 'center', padding: 12, borderRadius: 10, animation: 'fade-in .25s ease',
          background: result.ok ? color + '1a' : '#ef444422',
          border: `1.5px solid ${result.ok ? color : '#ef4444'}`,
        }}>
          {result.ok
            ? <><span style={{ color: '#94a3b8', fontSize: 13 }}>물리 주소 = base {result.base} + {result.d} = </span>
                <span style={{ color, fontSize: 22, fontWeight: 800 }}>{result.phys}</span></>
            : <span style={{ color: '#fca5a5', fontSize: 14, fontWeight: 700 }}>
                ❌ 보호 위반 — 오프셋 {result.d}이(가) limit {result.limit}을 초과
              </span>}
        </div>
      )}

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-inputs">
          <label>세그먼트 # <input type="number" value={seg} onChange={e => setSeg(e.target.value)} className="viz-input" /></label>
          <label>오프셋 <input type="number" value={offset} onChange={e => setOffset(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={translate}>주소 변환 ▶</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
        <p className="viz-hint">오프셋을 limit보다 크게 입력하면 보호 위반 트랩을 볼 수 있습니다 (예: 세그먼트 1, 오프셋 30).</p>
      </div>
    </div>
  )
}
