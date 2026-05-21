import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
const VALUES = [90, 85, 100, 70, 60]

export default function ArrayMemViz({ color }) {
  const [declared, setDeclared] = useState(false)
  const [created, setCreated] = useState(false)
  const [cells, setCells] = useState(null)        // null | number[]
  const [filled, setFilled] = useState(-1)         // 마지막으로 값이 채워진 인덱스
  const [log, setLog] = useState('배열이 메모리에 만들어지는 과정을 단계별로 봅니다.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function run() {
    setBusy(true); abortRef.current = false
    setDeclared(false); setCreated(false); setCells(null); setFilled(-1)
    await sleep(300)

    setDeclared(true)
    setLog('① 선언 — int[] score;  참조변수만 생성됩니다 (아직 null, 값 공간 없음)')
    await sleep(1300)
    if (abortRef.current) return setBusy(false)

    setCreated(true); setCells([0, 0, 0, 0, 0])
    setLog('② 생성 — score = new int[5];  힙에 5칸이 만들어지고, 모두 기본값 0으로 초기화')
    await sleep(1500)
    if (abortRef.current) return setBusy(false)

    for (let k = 0; k < VALUES.length; k++) {
      if (abortRef.current) return setBusy(false)
      setCells(c => c.map((v, idx) => (idx === k ? VALUES[k] : v)))
      setFilled(k)
      setLog(`③ 값 저장 — score[${k}] = ${VALUES[k]};`)
      await sleep(750)
    }
    setLog('✅ 완료 — 참조변수 score(스택)는 힙에 있는 배열의 주소를 가리킵니다.')
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setDeclared(false); setCreated(false); setCells(null); setFilled(-1); setBusy(false)
      setLog('초기화됨 — 버튼을 눌러 다시 실행하세요.')
    }, 60)
  }

  return (
    <div className="viz">
      <div className="net-stage">
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* 스택 — 참조변수 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>호출 스택 (참조변수)</div>
            <div style={{
              width: 132, padding: '10px 8px', borderRadius: 10, background: '#1e293b',
              border: `1.5px solid ${declared ? color : '#334155'}`, opacity: declared ? 1 : 0.4,
              transition: 'all .3s ease',
            }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'ui-monospace, monospace' }}>int[] score</div>
              <div style={{
                marginTop: 5, fontSize: 14, fontWeight: 800,
                color: created ? color : '#64748b',
              }}>{created ? '0x100' : 'null'}</div>
            </div>
          </div>

          {/* 화살표 */}
          <div style={{ fontSize: 22, color: created ? color : '#334155', transition: 'color .3s' }}>▶</div>

          {/* 힙 — 배열 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>힙 (배열 객체)</div>
            {cells ? (
              <div style={{ display: 'flex', gap: 3 }}>
                {cells.map((v, k) => (
                  <div key={k}>
                    <div style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>[{k}]</div>
                    <div style={{
                      width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 7, fontSize: 15, fontWeight: 800,
                      background: filled === k ? color : '#0f172a',
                      border: `1.5px solid ${k <= filled ? color : '#334155'}`,
                      color: filled === k ? '#fff' : (k <= filled ? color : '#94a3b8'),
                      transition: 'all .25s ease',
                    }}>{v}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '14px 22px', borderRadius: 10, border: '1.5px dashed #334155',
                color: '#64748b', fontSize: 12,
              }}>아직 생성되지 않음</div>
            )}
          </div>
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={run}>배열 생성 과정 보기</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
