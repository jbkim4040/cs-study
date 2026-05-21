import { useState } from 'react'

const STATE_LABEL = { idle: '대기', cs: '임계 구역', blocked: '블록됨' }
const STATE_COLOR = { idle: '#64748b', cs: '#10b981', blocked: '#ef4444' }

export default function SyncViz({ color }) {
  const [sem, setSem] = useState(1)
  const [t1, setT1] = useState('idle')
  const [t2, setT2] = useState('idle')
  const [counter, setCounter] = useState(0)
  const [log, setLog] = useState('세마포어 S=1 (뮤텍스). wait(S)로 임계 구역 진입을 시도해보세요.')

  const inCS = t1 === 'cs' || t2 === 'cs'

  function wait(which) {
    const me = which === 1 ? t1 : t2
    const setMe = which === 1 ? setT1 : setT2
    if (me !== 'idle') return
    if (sem > 0) {
      setSem(0)
      setMe('cs')
      setCounter(c => c + 1)
      setLog(`T${which}: wait(S) 성공 — S=0, 임계 구역 진입. 다른 스레드는 들어올 수 없습니다.`)
    } else {
      setMe('blocked')
      setLog(`T${which}: wait(S) 실패 — S=0이므로 블록. 상대의 signal(S)을 기다립니다.`)
    }
  }

  function signal(which) {
    const me = which === 1 ? t1 : t2
    const setMe = which === 1 ? setT1 : setT2
    if (me !== 'cs') return
    setMe('idle')
    const other = which === 1 ? t2 : t1
    const setOther = which === 1 ? setT2 : setT1
    if (other === 'blocked') {
      setOther('cs')
      setCounter(c => c + 1)
      setLog(`T${which}: signal(S) — 블록돼 있던 T${which === 1 ? 2 : 1}을 깨워 임계 구역으로 넘김 (S=0 유지).`)
    } else {
      setSem(1)
      setLog(`T${which}: signal(S) — S=1, 임계 구역 진출. 이제 누구든 진입 가능합니다.`)
    }
  }

  function reset() {
    setSem(1); setT1('idle'); setT2('idle'); setCounter(0)
    setLog('초기화 — 세마포어 S=1')
  }

  function ThreadCard({ which, st }) {
    return (
      <div style={{ flex: 1, padding: 12, borderRadius: 10, background: '#1e293b', border: `1.5px solid ${STATE_COLOR[st]}` }}>
        <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 14 }}>스레드 T{which}</div>
        <div style={{ fontSize: 12, color: STATE_COLOR[st], fontWeight: 600, margin: '4px 0 9px' }}>● {STATE_LABEL[st]}</div>
        <div style={{ display: 'flex', gap: 5 }}>
          <button className="viz-btn" style={{ '--c': color, fontSize: '0.76rem', padding: '5px 9px' }}
            disabled={st !== 'idle'} onClick={() => wait(which)}>wait(S)</button>
          <button className="viz-btn" style={{ '--c': '#10b981', fontSize: '0.76rem', padding: '5px 9px' }}
            disabled={st !== 'cs'} onClick={() => signal(which)}>signal(S)</button>
        </div>
      </div>
    )
  }

  return (
    <div className="viz">
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>세마포어 S</div>
          <div style={{ width: 54, height: 54, borderRadius: 12, background: '#0f172a', border: `2px solid ${color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color }}>{sem}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>임계 구역</div>
          <div style={{ minWidth: 130, height: 54, borderRadius: 12,
            background: inCS ? '#10b98122' : '#0f172a',
            border: `2px ${inCS ? 'solid' : 'dashed'} ${inCS ? '#10b981' : '#334155'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: inCS ? '#10b981' : '#475569' }}>
            {t1 === 'cs' ? 'T1 진입 중' : t2 === 'cs' ? 'T2 진입 중' : '비어 있음'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>공유 counter</div>
          <div style={{ width: 54, height: 54, borderRadius: 12, background: '#0f172a', border: '2px solid #334155',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#e2e8f0' }}>{counter}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <ThreadCard which={1} st={t1} />
        <ThreadCard which={2} st={t2} />
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
        <p className="viz-hint">S=1인 뮤텍스 — 한 스레드만 임계 구역에 진입할 수 있어 상호 배제가 보장됩니다.</p>
      </div>
    </div>
  )
}
