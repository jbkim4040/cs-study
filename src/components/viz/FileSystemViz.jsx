import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const COLS = 8, ROWS = 5
const METHODS = {
  contiguous: { label: '연속 할당', data: [9, 10, 11, 12, 13], index: null },
  linked:     { label: '연결 할당', data: [3, 11, 18, 27, 34], index: null },
  indexed:    { label: '색인 할당', data: [6, 14, 22, 29, 37], index: 20 },
}

export default function FileSystemViz({ color }) {
  const [method, setMethod] = useState('contiguous')
  const [k, setK] = useState('3')
  const [active, setActive] = useState([]) // 접근 애니메이션 중 강조되는 블록들
  const [log, setLog] = useState('할당 방식을 고르고 "k번째 블록 읽기"로 접근 과정을 확인해보세요.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  const m = METHODS[method]
  const fileBlocks = new Set(m.data)

  function pickMethod(name) {
    abortRef.current = true
    setMethod(name); setActive([])
    const desc = name === 'contiguous' ? '연속된 블록에 배치 — 직접 접근 빠름, 외부 단편화'
      : name === 'linked' ? '블록이 다음 블록을 가리킴 — 단편화 없음, 직접 접근 불가'
      : '색인 블록에 모든 주소를 모음 — 직접 접근 가능'
    setLog(`${METHODS[name].label}: ${desc}`)
  }

  async function readBlock() {
    const kk = parseInt(k)
    if (isNaN(kk) || kk < 1 || kk > m.data.length) { setLog(`⚠️ k는 1~${m.data.length}`); return }
    setBusy(true); abortRef.current = false
    setActive([])
    if (method === 'contiguous') {
      setLog(`연속 할당: 시작 블록 + (${kk}−1) 로 주소를 바로 계산 → 직접 접근 O(1)`)
      await sleep(700)
      setActive([m.data[kk - 1]])
      setLog(`✅ ${kk}번째 데이터 블록(#${m.data[kk - 1]})에 한 번에 접근 완료.`)
    } else if (method === 'linked') {
      const path = []
      for (let i = 0; i < kk; i++) {
        if (abortRef.current) { setBusy(false); return }
        path.push(m.data[i])
        setActive([...path])
        setLog(`연결 할당: 블록 #${m.data[i]} 방문 — 포인터를 따라 ${i + 1}번째 이동…`)
        await sleep(600)
      }
      setLog(`✅ ${kk}번째 블록에 도달 — ${kk}번 따라가야 함 (직접 접근 불가, O(k)).`)
    } else {
      setActive([m.index])
      setLog(`색인 할당: 먼저 색인 블록(#${m.index})을 읽습니다…`)
      await sleep(800)
      if (abortRef.current) { setBusy(false); return }
      setActive([m.index, m.data[kk - 1]])
      setLog(`✅ 색인 블록에서 ${kk}번째 주소(#${m.data[kk - 1]})를 찾아 바로 접근 — 직접 접근 가능.`)
    }
    setBusy(false)
  }

  return (
    <div className="viz">
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 4, maxWidth: 380, margin: '0 auto' }}>
        {Array.from({ length: COLS * ROWS }, (_, b) => {
          const isData = fileBlocks.has(b)
          const isIndex = m.index === b
          const isActive = active.includes(b)
          const order = isData ? m.data.indexOf(b) + 1 : null
          let bg = '#1e293b', bd = '#334155', fg = '#475569'
          if (isData) { bg = color + '33'; bd = color; fg = '#e2e8f0' }
          if (isIndex) { bg = '#22d3ee33'; bd = '#22d3ee'; fg = '#a5f3fc' }
          if (isActive) { bg = color; bd = color; fg = '#fff' }
          return (
            <div key={b} style={{
              aspectRatio: '1', borderRadius: 6, background: bg, border: `1.5px solid ${bd}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: fg, fontWeight: 700,
            }}>
              <span style={{ fontSize: 8, opacity: 0.6 }}>{b}</span>
              {isIndex && <span>색인</span>}
              {isData && <span>{order}</span>}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', fontSize: 11, color: '#94a3b8' }}>
        <span><span style={{ color }}>■</span> 파일 데이터 블록</span>
        {m.index != null && <span><span style={{ color: '#22d3ee' }}>■</span> 색인 블록</span>}
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': method === 'contiguous' ? color : '#64748b' }} disabled={busy} onClick={() => pickMethod('contiguous')}>연속 할당</button>
          <button className="viz-btn" style={{ '--c': method === 'linked' ? color : '#64748b' }} disabled={busy} onClick={() => pickMethod('linked')}>연결 할당</button>
          <button className="viz-btn" style={{ '--c': method === 'indexed' ? color : '#64748b' }} disabled={busy} onClick={() => pickMethod('indexed')}>색인 할당</button>
        </div>
        <div className="viz-inputs">
          <label>k (1~5) <input type="number" value={k} onChange={e => setK(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={readBlock}>k번째 블록 읽기 ▶</button>
          <button className="viz-btn reset" onClick={() => { abortRef.current = true; setActive([]); setBusy(false); setLog('초기화됨') }}>초기화</button>
        </div>
      </div>
    </div>
  )
}
