import { useState } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function mkNode(val) { return { val, left: null, right: null } }
function nodeH(n) { return n ? 1 + Math.max(nodeH(n.left), nodeH(n.right)) : 0 }
function bf(n) { return n ? nodeH(n.left) - nodeH(n.right) : 0 }

// 일반 BST 삽입 (회전 없음 — 편향 가능)
function bstInsert(node, val) {
  if (!node) return mkNode(val)
  if (val < node.val) return { ...node, left: bstInsert(node.left, val) }
  if (val > node.val) return { ...node, right: bstInsert(node.right, val) }
  return node
}

// 회전 (불변 방식)
function rotR(y) { const x = y.left;  return { ...x, right: { ...y, left: x.right } } }   // LL 해소
function rotL(x) { const y = x.right; return { ...y, left:  { ...x, right: y.left } } }   // RR 해소

// AVL 삽입 — 삽입 후 균형이 깨지면 회전. rec에 회전 종류 기록
function avlInsert(node, val, rec) {
  if (!node) return mkNode(val)
  let n
  if (val < node.val) n = { ...node, left: avlInsert(node.left, val, rec) }
  else if (val > node.val) n = { ...node, right: avlInsert(node.right, val, rec) }
  else return node
  const b = bf(n)
  if (b > 1 && val < n.left.val)  { rec.type = 'LL'; rec.at = n.val; return rotR(n) }
  if (b < -1 && val > n.right.val) { rec.type = 'RR'; rec.at = n.val; return rotL(n) }
  if (b > 1 && val > n.left.val)  { rec.type = 'LR'; rec.at = n.val; return rotR({ ...n, left: rotL(n.left) }) }
  if (b < -1 && val < n.right.val) { rec.type = 'RL'; rec.at = n.val; return rotL({ ...n, right: rotR(n.right) }) }
  return n
}

function layout(node, level = 0, counter = { v: 0 }) {
  if (!node) return null
  const left = layout(node.left, level + 1, counter)
  const x = counter.v++ * 64
  const y = level * 72
  const right = layout(node.right, level + 1, counter)
  return { ...node, x, y, left, right }
}
function collect(node, out = []) {
  if (!node) return out
  collect(node.left, out); out.push(node); collect(node.right, out)
  return out
}
function edges(node, out = []) {
  if (!node) return out
  if (node.left) { out.push({ x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y }); edges(node.left, out) }
  if (node.right) { out.push({ x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y }); edges(node.right, out) }
  return out
}

const INIT_VALS = [30, 20, 50, 10, 60]
function buildInit() {
  let root = null
  for (const v of INIT_VALS) root = bstInsert(root, v)
  return root
}

const HL_FILL = { path: '#fde68a', visited: '#fde68a', found: '#6ee7b7', inserted: '#6ee7b7', unbalanced: '#fecaca' }
const HL_STROKE = { path: '#f59e0b', visited: '#f59e0b', found: '#10b981', inserted: '#10b981', unbalanced: '#ef4444' }

export default function BSTViz({ color }) {
  const [root, setRoot] = useState(buildInit)
  const [mode, setMode] = useState('bst')      // 'bst' | 'avl'
  const [inputVal, setInputVal] = useState('5')
  const [hl, setHl] = useState({})
  const [log, setLog] = useState('일반 BST 모드 — 삽입·탐색을 해보세요. AVL 모드로 바꾸면 회전을 볼 수 있습니다.')
  const [busy, setBusy] = useState(false)

  function pickMode(m) {
    if (busy) return
    setMode(m)
    setRoot(buildInit())
    setHl({})
    setLog(m === 'avl'
      ? 'AVL 모드 — 삽입 시 균형이 깨지면 자동으로 회전합니다. 예: 5를 삽입해보세요.'
      : '일반 BST 모드 — 회전 없이 삽입합니다 (한쪽으로 편향될 수 있음).')
  }

  function reset() {
    if (busy) return
    setRoot(buildInit()); setHl({})
    setLog(mode === 'avl' ? 'AVL 모드 — 5를 삽입해 LL 회전을 확인해보세요.' : '일반 BST 모드 — 삽입·탐색을 해보세요.')
  }

  async function doInsert() {
    if (busy) return
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요.'); return }
    let cur = root
    while (cur) { if (val === cur.val) { setLog(`${val}은(는) 이미 존재합니다.`); return } cur = val < cur.val ? cur.left : cur.right }
    if (collect(layout(root)).length >= 12) { setLog('⚠️ 시각화 공간을 위해 최대 12개 노드까지 가능합니다.'); return }

    if (mode === 'bst') {
      setRoot(bstInsert(root, val))
      setHl({ [val]: 'inserted' })
      setLog(`일반 BST: ${val} 삽입 — 회전 없음 (계속 한쪽으로 넣으면 편향 트리가 됨)`)
      setTimeout(() => setHl({}), 1100)
      return
    }
    // AVL 모드
    setBusy(true)
    const before = bstInsert(root, val)
    const rec = {}
    const after = avlInsert(root, val, rec)
    if (rec.type) {
      setRoot(before)
      setHl({ [val]: 'inserted', [rec.at]: 'unbalanced' })
      setLog(`${val} 삽입 → 노드 ${rec.at}의 균형 인수가 ±2로 깨짐 → ${rec.type} 회전 필요!`)
      await sleep(1300)
      setRoot(after)
      setHl({ [val]: 'inserted' })
      setLog(`✓ ${rec.type} 회전 완료 — 모든 노드의 균형 인수가 다시 ±1 이내로 복구`)
      await sleep(500)
      setHl({})
    } else {
      setRoot(after)
      setHl({ [val]: 'inserted' })
      setLog(`${val} 삽입 — 균형 유지 (|균형 인수| ≤ 1, 회전 불필요)`)
      await sleep(1100)
      setHl({})
    }
    setBusy(false)
  }

  async function doSearch() {
    if (busy) return
    const val = parseInt(inputVal)
    if (isNaN(val)) { setLog('⚠️ 숫자를 입력하세요.'); return }
    setBusy(true)
    const path = []
    let cur = root
    while (cur) { path.push(cur.val); if (val === cur.val) break; cur = val < cur.val ? cur.left : cur.right }
    for (let i = 0; i < path.length; i++) {
      const found = i === path.length - 1 && path[i] === val
      await sleep(480)
      setHl(prev => ({ ...prev, [path[i]]: found ? 'found' : 'visited' }))
      setLog(`${path[i]} 방문 — ${val} ${val < path[i] ? '< 왼쪽으로' : val > path[i] ? '> 오른쪽으로' : '= 발견!'}`)
    }
    if (path[path.length - 1] !== val) setLog(`${val}을(를) 찾지 못했습니다.`)
    await sleep(900)
    setHl({})
    setBusy(false)
  }

  const laid = layout(root)
  const nodes = collect(laid)
  const edgeList = edges(laid)
  const W = nodes.length ? Math.max(...nodes.map(n => n.x)) + 80 : 200
  const H = nodes.length ? Math.max(...nodes.map(n => n.y)) + 60 : 100
  const R = 21

  return (
    <div className="viz">
      <div className="tree-scroll">
        <svg width={Math.max(W + 20, 300)} height={H + 24} className="tree-svg">
          {edgeList.map((e, i) => (
            <line key={i} x1={e.x1 + R} y1={e.y1 + R} x2={e.x2 + R} y2={e.y2 + R} stroke="#334155" strokeWidth="2" />
          ))}
          {nodes.map(n => {
            const t = hl[n.val]
            const b = bf(n)
            return (
              <g key={n.val} transform={`translate(${n.x}, ${n.y})`}>
                <circle cx={R} cy={R} r={R}
                  fill={t ? HL_FILL[t] : '#1e293b'}
                  stroke={t ? HL_STROKE[t] : color}
                  strokeWidth={t ? 2.6 : 2} />
                <text x={R} y={R + 5} textAnchor="middle" fontSize="13" fontWeight="700"
                  fill={t ? '#1e293b' : '#e2e8f0'}>{n.val}</text>
                {mode === 'avl' && (
                  <g>
                    <circle cx={R * 2 - 2} cy={4} r={9}
                      fill={Math.abs(b) > 1 ? '#ef4444' : '#0f172a'}
                      stroke={Math.abs(b) > 1 ? '#ef4444' : '#475569'} strokeWidth="1" />
                    <text x={R * 2 - 2} y={7.5} textAnchor="middle" fontSize="9" fontWeight="700"
                      fill={Math.abs(b) > 1 ? '#fff' : '#94a3b8'}>{b > 0 ? '+' + b : b}</text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>모드 (작은 원 = 균형 인수):</div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': mode === 'bst' ? color : '#64748b' }} disabled={busy} onClick={() => pickMode('bst')}>일반 BST</button>
          <button className="viz-btn" style={{ '--c': mode === 'avl' ? '#8b5cf6' : '#64748b' }} disabled={busy} onClick={() => pickMode('avl')}>AVL 트리 (자동 회전)</button>
        </div>
        <div className="viz-inputs">
          <label>값 <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} className="viz-input" /></label>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': '#10b981' }} disabled={busy} onClick={doInsert}>삽입</button>
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={doSearch}>탐색</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
        {mode === 'avl' && (
          <p className="viz-hint">초기 트리에서 5→LL · 15→LR · 70→RR · 55→RL — 4가지 회전을 모두 볼 수 있어요 (각 시도 전 초기화).</p>
        )}
      </div>
    </div>
  )
}
