import { useState, useRef } from 'react'

const TREE = {
  val: 1,
  left: {
    val: 2,
    left: { val: 4, left: null, right: null },
    right: { val: 5, left: null, right: null },
  },
  right: {
    val: 3,
    left: { val: 6, left: null, right: null },
    right: { val: 7, left: null, right: null },
  },
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const W = 460, H = 240
const DEPTH_Y = [28, 100, 172]
const POS_X = {
  0: [W / 2],
  1: [W / 4, (W * 3) / 4],
  2: [W / 8, (W * 3) / 8, (W * 5) / 8, (W * 7) / 8],
}

function getNodes(root) {
  const nodes = []
  function dfs(node, depth, pos, parentKey) {
    if (!node) return
    const key = `${depth}-${pos}`
    nodes.push({ val: node.val, depth, pos, parentKey, key })
    dfs(node.left, depth + 1, pos * 2, key)
    dfs(node.right, depth + 1, pos * 2 + 1, key)
  }
  dfs(root, 0, 0, null)
  return nodes
}

function preorder(node) {
  if (!node) return []
  return [node.val, ...preorder(node.left), ...preorder(node.right)]
}
function inorder(node) {
  if (!node) return []
  return [...inorder(node.left), node.val, ...inorder(node.right)]
}
function postorder(node) {
  if (!node) return []
  return [...postorder(node.left), ...postorder(node.right), node.val]
}
function levelorder(root) {
  const q = [root], res = []
  while (q.length) {
    const n = q.shift()
    if (!n) continue
    res.push(n.val)
    if (n.left) q.push(n.left)
    if (n.right) q.push(n.right)
  }
  return res
}

export default function TreeViz({ color }) {
  const [hlSet, setHlSet] = useState(new Set())
  const [visited, setVisited] = useState([])
  const [log, setLog] = useState('전위·중위·후위·레벨 순회를 눌러 직접 확인해보세요.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  const nodes = getNodes(TREE)
  const byKey = Object.fromEntries(nodes.map(n => [n.key, n]))

  function cx(n) { return (POS_X[n.depth] ?? [])[n.pos % (1 << n.depth)] ?? W / 2 }
  function cy(n) { return DEPTH_Y[n.depth] ?? 200 }

  async function runOrder(seq, label) {
    setBusy(true); abortRef.current = false
    setHlSet(new Set()); setVisited([])
    const seen = []
    for (const val of seq) {
      if (abortRef.current) { setBusy(false); return }
      seen.push(val)
      setHlSet(new Set(seen))
      setVisited([...seen])
      setLog(`${label} 방문: ${seen.join(' → ')}`)
      await sleep(520)
    }
    setLog(`${label} 완료: [${seen.join(', ')}]`)
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setHlSet(new Set()); setVisited([]); setLog('초기화됨'); setBusy(false) }, 50)
  }

  return (
    <div className="viz">
      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        {nodes.map(n => {
          if (!n.parentKey) return null
          const p = byKey[n.parentKey]
          if (!p) return null
          return (
            <line key={`e-${n.key}`}
              x1={cx(p)} y1={cy(p)} x2={cx(n)} y2={cy(n)}
              stroke="#334155" strokeWidth="1.8" />
          )
        })}
        {nodes.map(n => {
          const hl = hlSet.has(n.val)
          return (
            <g key={n.key}>
              <circle cx={cx(n)} cy={cy(n)} r={22}
                fill={hl ? color + '33' : '#1e293b'}
                stroke={hl ? color : '#475569'} strokeWidth="2" />
              <text x={cx(n)} y={cy(n) + 5} textAnchor="middle"
                fontSize="14" fill={hl ? color : '#e2e8f0'} fontWeight="700">{n.val}</text>
            </g>
          )
        })}
      </svg>

      {visited.length > 0 && (
        <div style={{ textAlign: 'center', fontSize: '13px', margin: '4px 0 8px', lineHeight: '1.8' }}>
          {visited.map((v, i) => (
            <span key={i} style={{ color, marginRight: 4 }}>{v}{i < visited.length - 1 ? ' →' : ''}</span>
          ))}
        </div>
      )}

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={() => runOrder(preorder(TREE), '전위')} disabled={busy}>전위 순회</button>
          <button className="viz-btn" style={{ '--c': '#10b981' }} onClick={() => runOrder(inorder(TREE), '중위')} disabled={busy}>중위 순회</button>
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} onClick={() => runOrder(postorder(TREE), '후위')} disabled={busy}>후위 순회</button>
          <button className="viz-btn" style={{ '--c': '#8b5cf6' }} onClick={() => runOrder(levelorder(TREE), '레벨')} disabled={busy}>레벨 순회</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
