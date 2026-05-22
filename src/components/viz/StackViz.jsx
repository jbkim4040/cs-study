import { useState, useEffect, useRef } from 'react'

const INIT = [10, 20, 30]

export default function StackViz({ color, pendingOp, onAction }) {
  const [stack, setStack] = useState(INIT)
  const [inputVal, setInputVal] = useState('40')
  const [log, setLog] = useState('push/pop을 눌러 스택 연산을 체험해 보세요.')
  const [newItem, setNewItem] = useState(null)
  const [poppingIdx, setPoppingIdx] = useState(null)
  const stackRef = useRef(INIT)

  // --- internal animation helpers (no onAction) ---
  function pushExt(val) {
    setNewItem(val)
    setTimeout(() => {
      setStack(s => { const ns = [...s, val]; stackRef.current = ns; return ns })
      setNewItem(null)
      setLog(`push(${val}) — 꼭대기에 ${val} 추가 완료! O(1)`)
    }, 350)
  }

  function popExt() {
    const cur = stackRef.current
    if (cur.length === 0) return
    const top = cur[cur.length - 1]
    setPoppingIdx(cur.length - 1)
    setTimeout(() => {
      setStack(s => { const ns = s.slice(0, -1); stackRef.current = ns; return ns })
      setPoppingIdx(null)
      setLog(`pop() = ${top} — 꼭대기에서 ${top} 제거 완료! O(1)`)
    }, 350)
  }

  function peekExt() {
    const cur = stackRef.current
    if (cur.length === 0) return
    setLog(`peek() = ${cur[cur.length - 1]} — 꼭대기 값 확인 (제거 없음) O(1)`)
  }

  // --- user-facing button handlers (fire onAction) ---
  function push() {
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요.'); return }
    onAction?.('push')
    pushExt(val)
  }

  function pop() {
    if (stackRef.current.length === 0) {
      setLog('⚠️ Stack Underflow — 스택이 비어 있습니다.')
      return
    }
    onAction?.('pop')
    popExt()
  }

  function peek() {
    if (stackRef.current.length === 0) { setLog('⚠️ 스택이 비어 있습니다.'); return }
    onAction?.('peek')
    peekExt()
  }

  function reset() {
    stackRef.current = INIT
    setStack(INIT)
    setNewItem(null)
    setPoppingIdx(null)
    setLog('push/pop을 눌러 스택 연산을 체험해 보세요.')
  }

  // --- respond to code-driven operations ---
  useEffect(() => {
    if (!pendingOp) return
    const { op, args } = pendingOp
    if (op === 'push') pushExt(args[0])
    else if (op === 'pop') popExt()
    else if (op === 'peek') peekExt()
    else if (op === 'reset') reset()
  }, [pendingOp]) // eslint-disable-line react-hooks/exhaustive-deps

  const items = [...stack].reverse()

  return (
    <div className="viz">
      <div className="stack-viz-area">
        <div className="stack-column">
          {newItem !== null && (
            <div className="stack-box entering" style={{ '--c': color }}>
              <span>{newItem}</span>
              <span className="stack-label">← push 중</span>
            </div>
          )}
          {items.map((v, i) => {
            const origIdx = stack.length - 1 - i
            const isTop = i === 0
            const isPopping = origIdx === poppingIdx
            return (
              <div
                key={origIdx}
                className={'stack-box' + (isPopping ? ' leaving' : '')}
                style={{ '--c': isTop ? color : '#94a3b8' }}
              >
                <span>{v}</span>
                {isTop && <span className="stack-label">← top</span>}
              </div>
            )
          })}
          {stack.length === 0 && (
            <div className="stack-empty">비어 있음</div>
          )}
        </div>
        <div className="stack-base">🔽 바닥</div>
      </div>

      <div className="viz-log">
        <span>{log}</span>
      </div>

      <div className="viz-controls">
        <div className="viz-inputs">
          <label>값 <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={push}>push</button>
          <button className="viz-btn" style={{ '--c': '#ef4444' }} onClick={pop}>pop</button>
          <button className="viz-btn" style={{ '--c': '#6b7280' }} onClick={peek}>peek</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
