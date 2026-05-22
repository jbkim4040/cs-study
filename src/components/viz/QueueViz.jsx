import { useState, useEffect, useRef } from 'react'

const INIT = [10, 20, 30]

export default function QueueViz({ color, pendingOp, onAction }) {
  const [queue, setQueue] = useState(INIT)
  const [inputVal, setInputVal] = useState('40')
  const [log, setLog] = useState('enqueue/dequeue를 눌러 큐 연산을 체험해 보세요.')
  const [entering, setEntering] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const queueRef = useRef(INIT)

  // --- internal animation helpers (no onAction) ---
  function enqueueExt(val) {
    setEntering(true)
    setTimeout(() => {
      setQueue(q => { const nq = [...q, val]; queueRef.current = nq; return nq })
      setEntering(false)
      setLog(`enqueue(${val}) — rear(뒤)에 ${val} 추가 완료! O(1)`)
    }, 350)
  }

  function dequeueExt() {
    const cur = queueRef.current
    if (cur.length === 0) return
    const front = cur[0]
    setLeaving(true)
    setTimeout(() => {
      setQueue(q => { const nq = q.slice(1); queueRef.current = nq; return nq })
      setLeaving(false)
      setLog(`dequeue() = ${front} — front(앞)에서 ${front} 제거 완료! O(1)`)
    }, 350)
  }

  function peekExt() {
    const cur = queueRef.current
    if (cur.length === 0) return
    setLog(`front = ${cur[0]}, rear = ${cur[cur.length - 1]} — 양 끝 확인 O(1)`)
  }

  // --- user-facing button handlers (fire onAction) ---
  function enqueue() {
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요.'); return }
    onAction?.('enqueue')
    enqueueExt(val)
  }

  function dequeue() {
    if (queueRef.current.length === 0) {
      setLog('⚠️ 큐가 비어 있습니다.')
      return
    }
    onAction?.('dequeue')
    dequeueExt()
  }

  function peek() {
    if (queueRef.current.length === 0) { setLog('⚠️ 큐가 비어 있습니다.'); return }
    onAction?.('peek')
    peekExt()
  }

  function reset() {
    queueRef.current = INIT
    setQueue(INIT)
    setEntering(false)
    setLeaving(false)
    setLog('enqueue/dequeue를 눌러 큐 연산을 체험해 보세요.')
  }

  // --- respond to code-driven operations ---
  useEffect(() => {
    if (!pendingOp) return
    const { op, args } = pendingOp
    if (op === 'enqueue') enqueueExt(args[0])
    else if (op === 'dequeue') dequeueExt()
    else if (op === 'peek') peekExt()
    else if (op === 'reset') reset()
  }, [pendingOp]) // eslint-disable-line react-hooks/exhaustive-deps

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
