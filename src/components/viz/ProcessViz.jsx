import { useState } from 'react'

const NODES = {
  new:        { label: '생성',  sub: 'New',        x: 78,  y: 52 },
  ready:      { label: '준비',  sub: 'Ready',      x: 205, y: 145 },
  running:    { label: '실행',  sub: 'Running',    x: 355, y: 145 },
  waiting:    { label: '대기',  sub: 'Waiting',    x: 268, y: 250 },
  terminated: { label: '종료',  sub: 'Terminated', x: 445, y: 52 },
}

const EDGES = [
  { from: 'new', to: 'ready', label: 'admit' },
  { from: 'ready', to: 'running', label: 'dispatch' },
  { from: 'running', to: 'ready', label: 'timeout' },
  { from: 'running', to: 'waiting', label: 'I/O 요청' },
  { from: 'waiting', to: 'ready', label: 'I/O 완료' },
  { from: 'running', to: 'terminated', label: 'exit' },
]

const NEXT = {
  new: [{ to: 'ready', btn: 'admit (수용)', msg: 'PCB 생성 완료 → 준비 큐로 진입' }],
  ready: [{ to: 'running', btn: 'dispatch', msg: '스케줄러가 CPU를 할당 → 실행 시작' }],
  running: [
    { to: 'ready', btn: 'timeout (선점)', msg: '타임 슬라이스 소진 → 준비 큐로 복귀' },
    { to: 'waiting', btn: 'I/O 요청', msg: '입출력 시작 → CPU 반납, 대기 상태로' },
    { to: 'terminated', btn: 'exit (종료)', msg: '실행 완료 → 자원 회수 후 PCB 제거' },
  ],
  waiting: [{ to: 'ready', btn: 'I/O 완료', msg: '입출력 종료 → 다시 준비 상태로' }],
  terminated: [],
}

const W = 530, H = 305, R = 38

export default function ProcessViz({ color }) {
  const [state, setState] = useState('new')
  const [log, setLog] = useState('프로세스가 생성(New) 상태입니다. 버튼으로 상태를 전이해보세요.')

  return (
    <div className="viz">
      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        <defs>
          <marker id="pv-a" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
          </marker>
          <marker id="pv-h" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={color} />
          </marker>
        </defs>
        {EDGES.map((e, i) => {
          const a = NODES[e.from], b = NODES[e.to]
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.hypot(dx, dy)
          const ux = dx / dist, uy = dy / dist
          const x1 = a.x + ux * R, y1 = a.y + uy * R
          const x2 = b.x - ux * R, y2 = b.y - uy * R
          const active = state === e.from
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={active ? color : '#334155'} strokeWidth={active ? 2.5 : 1.5}
                markerEnd={active ? 'url(#pv-h)' : 'url(#pv-a)'} />
              <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 5} textAnchor="middle" fontSize="10"
                fill={active ? color : '#64748b'} fontWeight="600">{e.label}</text>
            </g>
          )
        })}
        {Object.entries(NODES).map(([key, n]) => {
          const cur = state === key
          return (
            <g key={key}>
              <circle cx={n.x} cy={n.y} r={R}
                fill={cur ? color + '33' : '#1e293b'}
                stroke={cur ? color : '#475569'} strokeWidth={cur ? 3 : 2} />
              <text x={n.x} y={n.y - 1} textAnchor="middle" fontSize="14"
                fill={cur ? color : '#e2e8f0'} fontWeight="700">{n.label}</text>
              <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize="9" fill="#64748b">{n.sub}</text>
            </g>
          )
        })}
      </svg>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          {NEXT[state].map((tr, i) => (
            <button key={i} className="viz-btn" style={{ '--c': color }}
              onClick={() => { setState(tr.to); setLog(tr.msg) }}>
              {tr.btn}
            </button>
          ))}
          {state === 'terminated' &&
            <span style={{ color: '#64748b', fontSize: 13, alignSelf: 'center' }}>프로세스가 종료되었습니다.</span>}
          <button className="viz-btn reset" onClick={() => { setState('new'); setLog('초기화 — 생성(New) 상태') }}>초기화</button>
        </div>
      </div>
    </div>
  )
}
