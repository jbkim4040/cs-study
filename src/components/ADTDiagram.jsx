import { useState } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ADT를 "인터페이스(연산) + 숨겨진 구현"으로 보여주는 인터랙티브 다이어그램
export default function ADTDiagram({ adt, color }) {
  const ops = adt.operations || []
  const [sel, setSel] = useState(0)
  const [phase, setPhase] = useState('idle')   // idle | call | process | done
  const [busy, setBusy] = useState(false)

  async function callOp(i) {
    setSel(i); setBusy(true); setPhase('call')
    await sleep(620)
    setPhase('process')
    await sleep(880)
    setPhase('done')
    setBusy(false)
  }

  const op = ops[sel]
  const status = {
    idle: '연산 버튼을 누르면 ADT가 어떻게 호출되는지 단계별로 보여줍니다.',
    call: `① 호출 — 외부에서 ${op ? op.sig : ''} 연산을 요청합니다`,
    process: '② 내부 처리 — 실제 구현(배열·연결 리스트 등)은 캡슐 안에 숨겨져 있습니다',
    done: `③ 반환 — 호출자는 구현을 몰라도 결과만 받습니다`,
  }[phase]

  const tokenIn = phase === 'call' || phase === 'process'

  return (
    <div className="adt-stage" style={{ '--color': color }}>
      <div className="adt-iface-label">인터페이스 — 외부에서 호출할 수 있는 연산</div>
      <div className="adt-ops">
        {ops.map((o, i) => (
          <button
            key={i}
            className={'adt-op' + (sel === i ? ' active' : '')}
            disabled={busy}
            onClick={() => callOp(i)}
          >
            {o.sig}
          </button>
        ))}
      </div>

      <div className="adt-diagram">
        <div
          className={'adt-token' + (phase === 'idle' ? ' hidden' : '')}
          style={{ top: tokenIn ? '46px' : '2px' }}
        >
          {phase === 'done' ? '결과 반환 ▲' : (op ? op.sig + ' ▼' : '')}
        </div>
        <div className={'adt-box' + (phase === 'process' ? ' working' : '')}>
          <div className="adt-box-bar">추상화 장벽 — 구현 은닉 (encapsulation)</div>
          <div className="adt-box-impl">
            {phase === 'process'
              ? '내부에서 처리 중…'
              : '배열로도, 연결 리스트로도 구현 가능 — 사용하는 쪽은 알 필요가 없다'}
          </div>
        </div>
      </div>

      <div className="adt-status">{status}</div>
      {op && (
        <div className="adt-detail">
          <code className="sig">{op.sig}</code>
          <span className="adt-detail-desc">{op.desc}</span>
          {op.complexity && <span className="badge" style={{ '--color': color }}>{op.complexity}</span>}
        </div>
      )}
    </div>
  )
}
