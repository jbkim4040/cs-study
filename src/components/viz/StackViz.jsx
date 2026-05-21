import { useState } from 'react'

const INIT = [10, 20, 30]

export default function StackViz({ color }) {
  const [stack, setStack] = useState(INIT)
  const [inputVal, setInputVal] = useState('40')
  const [log, setLog] = useState('push/pop을 눌러 스택 연산을 체험해 보세요.')
  const [newItem, setNewItem] = useState(null)
  const [poppingIdx, setPoppingIdx] = useState(null)

  function push() {
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요.'); return }
    setNewItem(val)
    setTimeout(() => {
      setStack(s => [...s, val])
      setNewItem(null)
      setLog(`push(${val}) — 꼭대기에 ${val} 추가 완료! O(1)`)
    }, 350)
  }

  function pop() {
    if (stack.length === 0) {
      setLog('⚠️ Stack Underflow — 스택이 비어 있습니다.')
      return
    }
    const top = stack[stack.length - 1]
    setPoppingIdx(stack.length - 1)
    setTimeout(() => {
      setStack(s => s.slice(0, -1))
      setPoppingIdx(null)
      setLog(`pop() = ${top} — 꼭대기에서 ${top} 제거 완료! O(1)`)
    }, 350)
  }

  function peek() {
    if (stack.length === 0) { setLog('⚠️ 스택이 비어 있습니다.'); return }
    setLog(`peek() = ${stack[stack.length - 1]} — 꼭대기 값 확인 (제거 없음) O(1)`)
  }

  function reset() {
    setStack(INIT)
    setLog('push/pop을 눌러 스택 연산을 체험해 보세요.')
  }

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
