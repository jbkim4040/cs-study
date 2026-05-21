import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function ExceptionViz({ color }) {
  const [frames, setFrames] = useState([])      // [{name, hasCatch}] — index 0 = main(맨 아래)
  const [exAt, setExAt] = useState(-1)          // 예외가 현재 머문 프레임 index
  const [status, setStatus] = useState(null)    // 'caught' | 'crash' | null
  const [finallyRun, setFinallyRun] = useState(false)
  const [log, setLog] = useState('예외가 호출 스택을 따라 어떻게 전파되는지 봅니다.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function run(handled) {
    setBusy(true); abortRef.current = false
    setFrames([]); setExAt(-1); setStatus(null); setFinallyRun(false)
    await sleep(300)

    const fr = []
    const push = async (name, hasCatch, msg) => {
      fr.push({ name, hasCatch })
      setFrames([...fr]); setLog(msg)
      await sleep(850)
    }
    if (abortRef.current) return setBusy(false)
    await push('main()', handled, handled
      ? 'main()이 호출됨 — try-catch로 예외를 처리할 준비가 되어 있습니다.'
      : 'main()이 호출됨 — try-catch가 없습니다.')
    if (abortRef.current) return setBusy(false)
    await push('method1()', false, 'main()이 method1()을 호출 — 프레임 push.')
    if (abortRef.current) return setBusy(false)
    await push('method2()', false, 'method1()이 method2()를 호출 — 프레임 push.')
    if (abortRef.current) return setBusy(false)

    setExAt(2)
    setLog('⚠ method2()에서 예외 발생! (throw) — 처리할 catch를 찾기 시작합니다.')
    await sleep(1300)

    for (let i = 2; i >= 0; i--) {
      if (abortRef.current) return setBusy(false)
      if (fr[i].hasCatch) {
        setStatus('caught')
        setLog(`✅ ${fr[i].name}의 catch 블록이 예외를 처리했습니다.`)
        await sleep(1300)
        setFinallyRun(true)
        setLog('finally 블록 실행 — 예외 발생 여부와 무관하게 항상 수행됩니다.')
        await sleep(1300)
        setLog('✅ 예외가 처리되어 프로그램이 정상 종료됩니다.')
        setBusy(false)
        return
      }
      // 처리 못함 → 프레임 pop, 호출한 메서드로 전달
      fr.pop()
      setFrames([...fr])
      setExAt(i - 1)
      if (i > 0) {
        setLog(`${['main()', 'method1()', 'method2()'][i]}에 catch 없음 → 호출한 ${['main()', 'method1()'][i - 1]}(으)로 예외 전달.`)
        await sleep(1150)
      }
    }
    // 아무도 처리 못함
    setStatus('crash')
    setLog('❌ 어떤 메서드도 예외를 처리하지 못함 → 프로그램이 비정상 종료됩니다.')
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setFrames([]); setExAt(-1); setStatus(null); setFinallyRun(false); setBusy(false)
      setLog('초기화됨 — 버튼을 눌러 다시 실행하세요.')
    }, 60)
  }

  return (
    <div className="viz">
      <div className="net-stage">
        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textAlign: 'center' }}>
          호출 스택 (Call Stack) — 위가 최근 호출
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', minHeight: 150, justifyContent: 'flex-end' }}>
          {frames.length === 0 && <div style={{ color: '#475569', fontSize: 12, paddingBottom: 40 }}>스택이 비어 있음</div>}
          {[...frames].reverse().map((f, ri) => {
            const idx = frames.length - 1 - ri
            const hasEx = exAt === idx
            const caughtHere = hasEx && status === 'caught'
            return (
              <div key={idx} style={{
                width: 280, padding: '8px 12px', borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: caughtHere ? '#064e3b' : (hasEx ? '#450a0a' : '#1e293b'),
                border: `1.5px solid ${caughtHere ? '#10b981' : (hasEx ? '#ef4444' : (f.hasCatch ? color : '#334155'))}`,
                animation: 'net-fade .35s ease', transition: 'all .3s ease',
              }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#e2e8f0', fontFamily: 'ui-monospace, monospace' }}>
                  {f.name}
                </span>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {f.hasCatch && <span style={{ fontSize: 9, fontWeight: 700, color, background: '#0f172a', padding: '2px 6px', borderRadius: 4 }}>try-catch</span>}
                  {hasEx && <span style={{ fontSize: 11, fontWeight: 800, color: caughtHere ? '#10b981' : '#ef4444' }}>
                    {caughtHere ? '✓ 잡힘' : '⚠ 예외'}
                  </span>}
                </span>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', minHeight: 24 }}>
          {finallyRun && <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8', background: '#1e293b', padding: '4px 12px', borderRadius: 6, border: '1px solid #38bdf8' }}>finally 실행됨</span>}
          {status === 'caught' && <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: '#1e293b', padding: '4px 12px', borderRadius: 6, border: '1px solid #10b981' }}>정상 종료</span>}
          {status === 'crash' && <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: '#1e293b', padding: '4px 12px', borderRadius: 6, border: '1px solid #ef4444' }}>비정상 종료</span>}
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={() => run(true)}>예외 발생 → catch 처리</button>
          <button className="viz-btn" style={{ '--c': '#ef4444' }} disabled={busy} onClick={() => run(false)}>예외 발생 → 미처리</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
