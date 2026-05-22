import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
const N = 5

const PHASES = [
  { key: 'init', label: '① 초기화', code: 'int i = 1' },
  { key: 'cond', label: '② 조건식', code: 'i <= 5' },
  { key: 'body', label: '③ 문장', code: 'sum += i' },
  { key: 'inc',  label: '④ 증감식', code: 'i++' },
]

export default function FlowControlViz({ color }) {
  const [phase, setPhase] = useState(null)
  const [i, setI] = useState('-')
  const [sum, setSum] = useState('-')
  const [rows, setRows] = useState([])
  const [log, setLog] = useState('for문이 1부터 5까지 더하는 과정을 단계별로 추적합니다.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function run() {
    setBusy(true); abortRef.current = false
    setRows([]); setI('-'); setSum('-')
    let curI = 1, curSum = 0
    setPhase('init'); setI(1); setSum(0)
    setLog('① 초기화 — int i = 1 (처음 한 번만 실행)')
    await sleep(950)
    while (true) {
      if (abortRef.current) return setBusy(false)
      setPhase('cond')
      setLog(`② 조건식 — i(${curI}) <= ${N} → ${curI <= N ? 'true ▶ 계속' : 'false ▶ 종료'}`)
      await sleep(900)
      if (curI > N) break
      if (abortRef.current) return setBusy(false)
      setPhase('body'); curSum += curI; setSum(curSum)
      setLog(`③ 문장 실행 — sum += i → sum = ${curSum - curI} + ${curI} = ${curSum}`)
      setRows(r => [...r, { i: curI, sum: curSum }])
      await sleep(950)
      if (abortRef.current) return setBusy(false)
      setPhase('inc'); curI++; setI(curI)
      setLog(`④ 증감식 — i++ → i = ${curI} (다시 ②로)`)
      await sleep(850)
    }
    setPhase('done')
    setLog(`✅ 조건식이 false가 되어 종료 — 1부터 ${N}까지의 합 = ${curSum}`)
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setPhase(null); setI('-'); setSum('-'); setRows([]); setBusy(false)
      setLog('초기화됨 — 버튼을 눌러 다시 실행하세요.')
    }, 60)
  }

  return (
    <div className="viz">
      <div className="net-stage">
        {/* 단계 표시 */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {PHASES.map(p => {
            const on = phase === p.key
            return (
              <div key={p.key} style={{
                padding: '5px 8px', borderRadius: 8, minWidth: 70, flex: '1 1 70px', textAlign: 'center',
                background: on ? color : '#1e293b',
                border: `1.5px solid ${on ? color : '#334155'}`,
                transition: 'all .2s ease',
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: on ? '#fff' : '#94a3b8' }}>{p.label}</div>
                <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: on ? '#fff' : '#64748b' }}>{p.code}</div>
              </div>
            )
          })}
        </div>

        {/* 변수 상태 */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          {[['i', i], ['sum', sum]].map(([name, val]) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', background: '#0f172a',
              border: `1.5px solid ${color}`, borderRadius: 10,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', fontFamily: 'ui-monospace, monospace' }}>{name}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color }}>{val}</span>
            </div>
          ))}
        </div>

        {/* 반복 기록 */}
        {rows.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
            {rows.map((r, k) => (
              <span key={k} style={{
                padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1',
              }}>
                i={r.i} → sum={r.sum}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={run}>for문 실행</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
