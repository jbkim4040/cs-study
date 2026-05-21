import { useState } from 'react'

const N_PAGES = 8
const N_FRAMES = 4

function emptyPT() { return Array.from({ length: N_PAGES }, () => ({ valid: false, frame: null })) }

export default function VirtualMemoryViz({ color }) {
  const [pt, setPt] = useState(emptyPT)
  const [frames, setFrames] = useState(() => Array(N_FRAMES).fill(null))
  const [fifo, setFifo] = useState([])
  const [stats, setStats] = useState({ hit: 0, fault: 0 })
  const [last, setLast] = useState(null)
  const [log, setLog] = useState('페이지 번호를 클릭해 접근해보세요. 처음엔 모든 페이지가 디스크에 있습니다.')

  function access(p) {
    if (pt[p].valid) {
      setStats(s => ({ ...s, hit: s.hit + 1 }))
      setLast({ page: p, type: 'hit' })
      setLog(`페이지 ${p} 접근 → ✅ 적중(Hit)! 이미 프레임 ${pt[p].frame}에 적재돼 있습니다.`)
      return
    }
    const newPt = pt.map(e => ({ ...e }))
    const newFrames = [...frames]
    let newFifo = [...fifo]
    let frameIdx = newFrames.indexOf(null)
    let msg
    if (frameIdx === -1) {
      const victim = newFifo[0]
      newFifo = newFifo.slice(1)
      frameIdx = newPt[victim].frame
      newPt[victim] = { valid: false, frame: null }
      msg = `페이지 ${p} → ❌ 페이지 폴트! 빈 프레임이 없어 페이지 ${victim}을(를) 내보내고(FIFO) 프레임 ${frameIdx}에 적재.`
    } else {
      msg = `페이지 ${p} → ❌ 페이지 폴트! 디스크에서 빈 프레임 ${frameIdx}(으)로 적재합니다.`
    }
    newFrames[frameIdx] = p
    newPt[p] = { valid: true, frame: frameIdx }
    newFifo.push(p)
    setPt(newPt); setFrames(newFrames); setFifo(newFifo)
    setStats(s => ({ ...s, fault: s.fault + 1 }))
    setLast({ page: p, type: 'fault' })
    setLog(msg)
  }

  function reset() {
    setPt(emptyPT()); setFrames(Array(N_FRAMES).fill(null))
    setFifo([]); setStats({ hit: 0, fault: 0 }); setLast(null)
    setLog('초기화됨 — 모든 페이지가 디스크에 있습니다.')
  }

  return (
    <div className="viz">
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', fontSize: 12 }}>
        <span style={{ padding: '4px 12px', borderRadius: 6, background: '#10b98122', border: '1px solid #10b981', color: '#4ade80', fontWeight: 700 }}>
          적중 {stats.hit}
        </span>
        <span style={{ padding: '4px 12px', borderRadius: 6, background: '#ef444422', border: '1px solid #ef4444', color: '#fca5a5', fontWeight: 700 }}>
          페이지 폴트 {stats.fault}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* 페이지 테이블 */}
        <div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>페이지 테이블</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {pt.map((e, p) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <span style={{ width: 22, color: '#94a3b8', fontWeight: 700, textAlign: 'center' }}>P{p}</span>
                <span style={{
                  width: 48, textAlign: 'center', padding: '2px 0', borderRadius: 4, fontWeight: 700,
                  background: e.valid ? '#10b98133' : '#1e293b',
                  color: e.valid ? '#4ade80' : '#64748b',
                  border: `1px solid ${e.valid ? '#10b981' : '#334155'}`,
                }}>{e.valid ? 'valid' : 'invalid'}</span>
                <span style={{ width: 44, textAlign: 'center', color: '#cbd5e1' }}>
                  {e.valid ? `프레임${e.frame}` : '디스크'}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* RAM 프레임 */}
        <div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>물리 메모리 ({N_FRAMES}프레임)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {frames.map((pg, f) => {
              const justLoaded = last && last.type === 'fault' && pg === last.page
              return (
                <div key={f} style={{
                  width: 110, padding: '8px 0', textAlign: 'center', borderRadius: 7,
                  background: pg == null ? '#1e293b' : (justLoaded ? color + '44' : color + '22'),
                  border: `1.5px solid ${pg == null ? '#334155' : color}`,
                  fontSize: 12, fontWeight: 700, color: pg == null ? '#475569' : '#e2e8f0',
                }}>
                  프레임 {f}: {pg == null ? '비어 있음' : `페이지 ${pg}`}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>페이지 접근 (클릭):</div>
        <div className="viz-btns">
          {Array.from({ length: N_PAGES }, (_, p) => (
            <button key={p} className="viz-btn" style={{ '--c': pt[p].valid ? '#10b981' : color }}
              onClick={() => access(p)}>페이지 {p}</button>
          ))}
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
