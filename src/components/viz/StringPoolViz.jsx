import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const VARS = [
  { name: 's1', code: 'String s1 = "abc";',              addr: '0x100', loc: 'pool', log: 's1 — 리터럴 "abc"가 상수 풀에 등록되고, s1이 그것을 가리킵니다.' },
  { name: 's2', code: 'String s2 = "abc";',              addr: '0x100', loc: 'pool', log: 's2 — 같은 리터럴 "abc"는 이미 풀에 있으므로, s2는 그 객체를 공유합니다.' },
  { name: 's3', code: 'String s3 = new String("abc");',  addr: '0x200', loc: 'heap', log: 's3 — new String()은 풀과 별개로 힙에 새 객체를 만듭니다.' },
  { name: 's4', code: 'String s4 = new String("abc");',  addr: '0x300', loc: 'heap', log: 's4 — new는 호출할 때마다 힙에 또 다른 객체를 만듭니다.' },
]
const COMPARES = [
  { expr: 's1 == s2',      result: true,  why: '0x100 == 0x100 — 같은 풀 객체' },
  { expr: 's1 == s3',      result: false, why: '0x100 ≠ 0x200 — 다른 객체' },
  { expr: 's3 == s4',      result: false, why: '0x200 ≠ 0x300 — 각각 새 객체' },
  { expr: 's1.equals(s3)', result: true,  why: '== 가 아닌 내용 비교 → "abc" 동일' },
]

export default function StringPoolViz({ color }) {
  const [shown, setShown] = useState(0)        // 보여준 변수 개수
  const [compares, setCompares] = useState(0)  // 보여준 비교 개수
  const [log, setLog] = useState('문자열 리터럴과 new String()이 메모리에서 어떻게 다른지 봅니다.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function run() {
    setBusy(true); abortRef.current = false
    setShown(0); setCompares(0)
    await sleep(350)
    for (let k = 0; k < VARS.length; k++) {
      if (abortRef.current) return setBusy(false)
      setShown(k + 1)
      setLog(VARS[k].log)
      await sleep(1450)
    }
    setLog('이제 == (주소 비교)와 equals() (내용 비교)의 결과를 확인합니다.')
    await sleep(1100)
    for (let k = 0; k < COMPARES.length; k++) {
      if (abortRef.current) return setBusy(false)
      setCompares(k + 1)
      setLog(`${COMPARES[k].expr} → ${COMPARES[k].result} — ${COMPARES[k].why}`)
      await sleep(1250)
    }
    setLog('✅ 핵심 — 리터럴은 상수 풀에서 공유, new String()은 힙에 매번 새 객체.')
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setShown(0); setCompares(0); setBusy(false)
      setLog('초기화됨 — 버튼을 눌러 다시 실행하세요.')
    }, 60)
  }

  const vis = VARS.slice(0, shown)
  const poolVars = vis.filter(v => v.loc === 'pool')
  const heapVars = vis.filter(v => v.loc === 'heap')

  const ObjBox = (addr, refs) => (
    <div style={{ textAlign: 'center', animation: 'net-fade .4s ease' }}>
      <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'ui-monospace, monospace' }}>{addr}</div>
      <div style={{
        width: 64, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0f172a', border: `1.5px solid ${color}`, borderRadius: 8,
        fontSize: 15, fontWeight: 800, color,
      }}>"abc"</div>
      <div style={{ fontSize: 9.5, color: '#94a3b8', marginTop: 2, minHeight: 12 }}>
        ◀ {refs.map(r => r.name).join(', ')}
      </div>
    </div>
  )

  return (
    <div className="viz">
      <div className="net-stage">
        {/* 선언된 변수 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {vis.map((v, k) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 11, fontFamily: 'ui-monospace, monospace',
              background: '#1e293b', borderRadius: 6, padding: '4px 9px',
              border: '1px solid #334155', animation: 'net-fade .35s ease',
            }}>
              <span style={{ color: '#cbd5e1' }}>{v.code}</span>
              <span style={{ color, fontWeight: 700 }}>{v.name} → {v.addr}</span>
            </div>
          ))}
          {vis.length === 0 && <div style={{ color: '#475569', fontSize: 12, textAlign: 'center', padding: 8 }}>아직 선언된 변수 없음</div>}
        </div>

        {/* 메모리 — 상수 풀 / 힙 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: '#1e293b', borderRadius: 10, padding: '8px 6px', border: '1.5px solid #334155' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: '#e2e8f0', textAlign: 'center', marginBottom: 6 }}>
              상수 풀 (Constant Pool)
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', minHeight: 70 }}>
              {poolVars.length > 0 ? ObjBox('0x100', poolVars)
                : <div style={{ color: '#475569', fontSize: 10, paddingTop: 24 }}>(비어 있음)</div>}
            </div>
          </div>
          <div style={{ flex: 1.3, background: '#1e293b', borderRadius: 10, padding: '8px 6px', border: '1.5px solid #334155' }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: '#e2e8f0', textAlign: 'center', marginBottom: 6 }}>
              힙 (Heap) — new String()
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', minHeight: 70 }}>
              {heapVars.length > 0
                ? heapVars.map(v => <div key={v.name}>{ObjBox(v.addr, [v])}</div>)
                : <div style={{ color: '#475569', fontSize: 10, paddingTop: 24 }}>(비어 있음)</div>}
            </div>
          </div>
        </div>

        {/* 비교 결과 */}
        {compares > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
            {COMPARES.slice(0, compares).map((c, k) => (
              <span key={k} style={{
                padding: '4px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700,
                background: '#0f172a', animation: 'net-fade .35s ease',
                border: `1.5px solid ${c.result ? '#10b981' : '#ef4444'}`,
                color: c.result ? '#10b981' : '#ef4444',
              }}>
                {c.expr} = {String(c.result)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={run}>String 메모리 보기</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
