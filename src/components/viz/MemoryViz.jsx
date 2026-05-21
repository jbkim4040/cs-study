import { useState, useRef } from 'react'

const TOTAL = 100
const INIT = [
  { type: 'used', size: 25, label: 'P1' },
  { type: 'free', size: 20 },
  { type: 'used', size: 15, label: 'P2' },
  { type: 'free', size: 10 },
  { type: 'used', size: 10, label: 'P3' },
  { type: 'free', size: 20 },
]

export default function MemoryViz({ color }) {
  const [blocks, setBlocks] = useState(INIT)
  const [size, setSize] = useState('18')
  const [hlLabel, setHlLabel] = useState(null)
  const [log, setLog] = useState('프로세스 크기를 정하고 배치 전략(최초·최적·최악 적합)을 선택하세요.')
  const uid = useRef(3)

  function allocate(strategy) {
    const sz = parseInt(size)
    if (isNaN(sz) || sz <= 0) { setLog('⚠️ 1 이상의 크기를 입력하세요.'); return }
    const cands = blocks.map((b, i) => ({ b, i })).filter(x => x.b.type === 'free' && x.b.size >= sz)
    if (!cands.length) {
      const freeTotal = blocks.filter(b => b.type === 'free').reduce((s, b) => s + b.size, 0)
      setHlLabel(null)
      setLog(`❌ 할당 실패 — ${sz}칸이 들어갈 연속 공간이 없습니다 (빈 공간 합 ${freeTotal}칸 — 외부 단편화).`)
      return
    }
    let pick
    if (strategy === 'first') pick = cands[0]
    else if (strategy === 'best') pick = cands.reduce((a, b) => (b.b.size < a.b.size ? b : a))
    else pick = cands.reduce((a, b) => (b.b.size > a.b.size ? b : a))

    const name = 'P' + (++uid.current)
    setBlocks(prev => {
      const next = []
      prev.forEach((b, i) => {
        if (i === pick.i) {
          next.push({ type: 'used', size: sz, label: name })
          if (b.size > sz) next.push({ type: 'free', size: b.size - sz })
        } else next.push(b)
      })
      return next
    })
    setHlLabel(name)
    const stratName = strategy === 'first' ? '최초 적합' : strategy === 'best' ? '최적 적합' : '최악 적합'
    const left = pick.b.size - sz
    setLog(`${stratName}: ${sz}칸짜리 ${name}을(를) ${pick.b.size}칸 빈 공간에 배치 — ${left > 0 ? `${left}칸 조각이 남음` : '정확히 채움'}`)
  }

  function reset() {
    setBlocks(INIT); setHlLabel(null); uid.current = 3
    setLog('초기화됨')
  }

  const freeTotal = blocks.filter(b => b.type === 'free').reduce((s, b) => s + b.size, 0)
  const largestHole = Math.max(0, ...blocks.filter(b => b.type === 'free').map(b => b.size))

  return (
    <div className="viz">
      <div style={{ display: 'flex', height: 56, borderRadius: 10, overflow: 'hidden', border: '1.5px solid #334155' }}>
        {blocks.map((b, i) => {
          const used = b.type === 'used'
          const hl = used && b.label === hlLabel
          return (
            <div key={i} style={{
              width: (b.size / TOTAL) * 100 + '%',
              background: used ? (hl ? color : color + '55') : 'repeating-linear-gradient(45deg,#1e293b,#1e293b 6px,#0f172a 6px,#0f172a 12px)',
              borderRight: i < blocks.length - 1 ? '1px solid #0f172a' : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: used ? '#fff' : '#64748b', fontSize: 11, fontWeight: 700,
              outline: hl ? `2px solid ${color}` : 'none', outlineOffset: -2,
            }}>
              <span>{used ? b.label : '빈 공간'}</span>
              <span style={{ fontSize: 9, opacity: 0.85, fontWeight: 500 }}>{b.size}</span>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', fontSize: 11 }}>
        <span style={{ padding: '3px 9px', borderRadius: 6, background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }}>
          빈 공간 합 <b style={{ color: '#e2e8f0' }}>{freeTotal}</b>
        </span>
        <span style={{ padding: '3px 9px', borderRadius: 6, background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }}>
          가장 큰 빈 공간 <b style={{ color: color }}>{largestHole}</b>
        </span>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-inputs">
          <label>프로세스 크기 <input type="number" value={size} onChange={e => setSize(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={() => allocate('first')}>최초 적합</button>
          <button className="viz-btn" style={{ '--c': '#10b981' }} onClick={() => allocate('best')}>최적 적합</button>
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} onClick={() => allocate('worst')}>최악 적합</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
