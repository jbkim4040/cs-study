import { useRef, useState } from 'react'

let uid = 100
const mkNode = (val) => ({ id: uid++, val })
const INIT = [10, 20, 30, 40].map(mkNode)

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function LinkedListViz({ color }) {
  const [nodes, setNodes] = useState(INIT)
  const [inputVal, setInputVal] = useState('99')
  const [hl, setHl] = useState({}) // id → type
  const [log, setLog] = useState('연결 리스트 연산을 직접 실행해 보세요.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setNodes(INIT.map(n => ({ ...n })))
      setHl({})
      setLog('연결 리스트 연산을 직접 실행해 보세요.')
      setBusy(false)
    }, 50)
  }

  function prepend() {
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요.'); return }
    const node = mkNode(val)
    setNodes(ns => [node, ...ns])
    setHl({ [node.id]: 'inserted' })
    setTimeout(() => setHl({}), 1000)
    setLog(`prepend(${val}) — 헤드 앞에 삽입 완료! O(1) — 포인터 교체만 필요`)
  }

  async function appendEnd() {
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요.'); return }
    setBusy(true)
    abortRef.current = false
    setLog('꼬리를 찾아 순회 중…')
    for (let i = 0; i < nodes.length; i++) {
      if (abortRef.current) { setBusy(false); return }
      setHl({ [nodes[i].id]: 'traverse' })
      setLog(`노드 ${i + 1}번 방문… (${nodes[i].val})`)
      await sleep(400)
    }
    const node = mkNode(val)
    setNodes(ns => [...ns, node])
    setHl({ [node.id]: 'inserted' })
    setTimeout(() => setHl({}), 1000)
    setLog(`append(${val}) — 꼬리에 삽입 완료! O(n) — ${nodes.length}번 순회 후 삽입`)
    setBusy(false)
  }

  function deleteHead() {
    if (nodes.length === 0) { setLog('⚠️ 리스트가 비어 있습니다.'); return }
    const head = nodes[0]
    setHl({ [head.id]: 'delete' })
    setTimeout(() => {
      setNodes(ns => ns.slice(1))
      setHl({})
      setLog(`deleteHead() = ${head.val} — 헤드 삭제 완료! O(1) — 헤드 포인터만 이동`)
    }, 400)
  }

  async function search() {
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요.'); return }
    setBusy(true)
    abortRef.current = false
    for (let i = 0; i < nodes.length; i++) {
      if (abortRef.current) { setBusy(false); return }
      setHl({ [nodes[i].id]: 'traverse' })
      setLog(`노드 ${i + 1}번 확인… (${nodes[i].val})`)
      await sleep(450)
      if (nodes[i].val === val) {
        setHl({ [nodes[i].id]: 'found' })
        setLog(`✓ ${val}을(를) ${i + 1}번째 노드에서 발견! O(n)`)
        setBusy(false)
        return
      }
    }
    if (!abortRef.current) {
      setHl({})
      setLog(`${val}을(를) 찾지 못했습니다. O(n)`)
    }
    setBusy(false)
  }

  const HL_COLOR = {
    traverse: '#f59e0b',
    inserted: '#10b981',
    delete: '#ef4444',
    found: '#10b981',
  }

  return (
    <div className="viz">
      <div className="ll-viz-area">
        {nodes.length === 0 && <div className="ll-empty">비어 있음</div>}
        {nodes.map((n, i) => {
          const hlType = hl[n.id]
          return (
            <div key={n.id} className="ll-item">
              <div
                className={'ll-node' + (hlType ? ' hl' : '')}
                style={hlType ? { '--c': HL_COLOR[hlType] } : { '--c': i === 0 ? color : '#94a3b8' }}
              >
                <div className="ll-node-data">{n.val}</div>
                <div className="ll-node-ptr">→</div>
              </div>
              {i === 0 && <div className="ll-pointer-label">head</div>}
              {i === nodes.length - 1 && (
                <div className="ll-null">null</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-inputs">
          <label>값 <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={prepend} disabled={busy}>헤드 삽입 O(1)</button>
          <button className="viz-btn" style={{ '--c': '#3b82f6' }} onClick={appendEnd} disabled={busy}>꼬리 삽입 O(n)</button>
          <button className="viz-btn" style={{ '--c': '#ef4444' }} onClick={deleteHead} disabled={busy}>헤드 삭제 O(1)</button>
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} onClick={search} disabled={busy}>탐색 O(n)</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
