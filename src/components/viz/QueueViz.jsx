import { useState } from 'react'

const INIT = [10, 20, 30]

export default function QueueViz({ color }) {
  const [queue, setQueue] = useState(INIT)
  const [inputVal, setInputVal] = useState('40')
  const [log, setLog] = useState('enqueue/dequeue를 눌러 큐 연산을 체험해 보세요.')
  const [entering, setEntering] = useState(false)
  const [leaving, setLeaving] = useState(false)

  function enqueue() {
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요.'); return }
    setEntering(true)
    setTimeout(() => {
      setQueue(q => [...q, val])
      setEntering(false)
      setLog(`enqueue(${val}) — rear(뒤)에 ${val} 추가 완료! O(1)`)
    }, 350)
  }

  function dequeue() {
    if (queue.length === 0) {
      setLog('⚠️ 큐가 비어 있습니다.')
      return
    }
    const front = queue[0]
    setLeaving(true)
    setTimeout(() => {
      setQueue(q => q.slice(1))
      setLeaving(false)
      setLog(`dequeue() = ${front} — front(앞)에서 ${front} 제거 완료! O(1)`)
    }, 350)
  }

  function peek() {
    if (queue.length === 0) { setLog('⚠️ 큐가 비어 있습니다.'); return }
    setLog(`front = ${queue[0]}, rear = ${queue[queue.length - 1]} — 양 끝 확인 O(1)`)
  }

  function reset() {
    setQueue(INIT)
    setLog('enqueue/dequeue를 눌러 큐 연산을 체험해 보세요.')
  }

  return (
    <div className="viz">
      <div className="queue-viz-area">
        <div className="queue-label-left">dequeue ←<br /><span>front</span></div>
        <div className="queue-row">
          {queue.length === 0 && <div className="queue-empty">비어 있음</div>}
          {queue.map((v, i) => (
            <div
              key={i}
              className={
                'queue-box' +
                (i === 0 && leaving ? ' leaving' : '') +
                (i === 0 ? ' is-front' : '') +
                (i === queue.length - 1 ? ' is-rear' : '')
              }
              style={{
                '--c': i === 0 ? '#ef4444' : i === queue.length - 1 ? color : '#94a3b8'
              }}
            >
              <span>{v}</span>
              {i === 0 && <span className="queue-tag">front</span>}
              {i === queue.length - 1 && i !== 0 && <span className="queue-tag">rear</span>}
            </div>
          ))}
          {entering && (
            <div className="queue-box entering" style={{ '--c': color }}>
              <span>{inputVal}</span>
              <span className="queue-tag">rear↑</span>
            </div>
          )}
        </div>
        <div className="queue-label-right">→ enqueue<br /><span>rear</span></div>
      </div>

      <div className="viz-log">
        <span>{log}</span>
      </div>

      <div className="viz-controls">
        <div className="viz-inputs">
          <label>값 <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={enqueue}>enqueue</button>
          <button className="viz-btn" style={{ '--c': '#ef4444' }} onClick={dequeue}>dequeue</button>
          <button className="viz-btn" style={{ '--c': '#6b7280' }} onClick={peek}>front/rear 확인</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
