import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Car c1 = new Car(); Car c2 = new Car(); 가 메모리에서 일어나는 과정
const STEPS = [
  {
    area: 'method',
    log: '① 클래스 로딩 — 클래스 정보와 static 변수가 메서드 영역에 적재됩니다.',
    method: [{ t: 'class', name: 'Car.class' }, { t: 'static', name: 'static count', val: 0 }, { t: 'class', name: 'Main.class' }],
    stack: [], heap: [],
  },
  {
    area: 'stack',
    log: '② main() 호출 — 호출 스택에 main 프레임이 push. 지역변수 c1, c2가 여기 위치.',
    method: 'keep',
    stack: [{ name: 'main()', vars: [{ name: 'c1', val: 'null' }, { name: 'c2', val: 'null' }] }],
    heap: 'keep',
  },
  {
    area: 'heap',
    log: '③ new Car() — 힙에 Car 인스턴스가 생성되고, 생성자에서 count++ 실행 → count=1.',
    method: [{ t: 'class', name: 'Car.class' }, { t: 'static', name: 'static count', val: 1 }, { t: 'class', name: 'Main.class' }],
    stack: 'keep',
    heap: [{ id: '0x100', label: 'Car 인스턴스' }],
  },
  {
    area: 'stack',
    log: '④ 주소 대입 — new가 반환한 인스턴스 주소(0x100)가 참조변수 c1에 저장됩니다.',
    method: 'keep',
    stack: [{ name: 'main()', vars: [{ name: 'c1', val: '0x100' }, { name: 'c2', val: 'null' }] }],
    heap: 'keep',
  },
  {
    area: 'heap',
    log: '⑤ new Car() 또 한 번 — 두 번째 인스턴스가 힙에 생성, count++ → count=2.',
    method: [{ t: 'class', name: 'Car.class' }, { t: 'static', name: 'static count', val: 2 }, { t: 'class', name: 'Main.class' }],
    stack: [{ name: 'main()', vars: [{ name: 'c1', val: '0x100' }, { name: 'c2', val: '0x200' }] }],
    heap: [{ id: '0x100', label: 'Car 인스턴스' }, { id: '0x200', label: 'Car 인스턴스' }],
  },
  {
    area: 'stack',
    log: '⑥ main() 종료 — 프레임이 pop되어 스택이 비워집니다. 인스턴스는 힙에 남아 GC 대상이 됩니다.',
    method: 'keep',
    stack: [],
    heap: 'keep',
  },
]

export default function JVMMemoryViz({ color }) {
  const [method, setMethod] = useState([])
  const [stack, setStack] = useState([])
  const [heap, setHeap] = useState([])
  const [active, setActive] = useState(null)
  const [log, setLog] = useState('Car c1 = new Car(); 두 줄이 JVM 메모리에서 어떻게 동작하는지 봅니다.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)

  async function run() {
    setBusy(true); abortRef.current = false
    setMethod([]); setStack([]); setHeap([]); setActive(null)
    await sleep(350)
    let m = [], s = [], h = []
    for (const step of STEPS) {
      if (abortRef.current) return setBusy(false)
      if (step.method !== 'keep') { m = step.method; setMethod(m) }
      if (step.stack !== 'keep') { s = step.stack; setStack(s) }
      if (step.heap !== 'keep') { h = step.heap; setHeap(h) }
      setActive(step.area)
      setLog(step.log)
      await sleep(1700)
    }
    setActive(null)
    setLog('✅ 완료 — 클래스 정보는 메서드 영역, 메서드 실행은 호출 스택, new 객체는 힙에 놓입니다.')
    setBusy(false)
  }

  function reset() {
    abortRef.current = true
    setTimeout(() => {
      abortRef.current = false
      setMethod([]); setStack([]); setHeap([]); setActive(null); setBusy(false)
      setLog('초기화됨 — 버튼을 눌러 다시 실행하세요.')
    }, 60)
  }

  const Col = ({ id, title, sub, children }) => (
    <div style={{
      flex: 1, minWidth: 0, background: '#1e293b', borderRadius: 11, padding: '9px 8px',
      border: `1.5px solid ${active === id ? color : '#334155'}`,
      boxShadow: active === id ? `0 0 16px -4px ${color}` : 'none',
      transition: 'all .3s ease',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 7 }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: active === id ? color : '#e2e8f0' }}>{title}</div>
        <div style={{ fontSize: 9, color: '#64748b' }}>{sub}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 116 }}>{children}</div>
    </div>
  )

  return (
    <div className="viz">
      <div className="net-stage">
        <div style={{ display: 'flex', gap: 8 }}>
          <Col id="method" title="메서드 영역" sub="클래스 정보 · static">
            {method.map((it, k) => (
              <div key={k} style={{
                padding: '5px 8px', borderRadius: 6, fontSize: 10.5, fontWeight: 700,
                background: '#0f172a',
                border: `1px solid ${it.t === 'static' ? color : '#334155'}`,
                color: it.t === 'static' ? color : '#cbd5e1',
                display: 'flex', justifyContent: 'space-between', gap: 6,
              }}>
                <span>{it.t === 'class' ? '📄 ' : '🔢 '}{it.name}</span>
                {it.val != null && <span style={{ fontWeight: 800 }}>{it.val}</span>}
              </div>
            ))}
          </Col>

          <Col id="stack" title="호출 스택" sub="프레임 · 지역변수">
            {stack.length === 0
              ? <div style={{ color: '#475569', fontSize: 10, textAlign: 'center', paddingTop: 16 }}>(비어 있음)</div>
              : stack.map((f, k) => (
                <div key={k} style={{ background: '#0f172a', border: `1.5px solid ${color}`, borderRadius: 7, padding: '5px 7px' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color, marginBottom: 3 }}>{f.name} 프레임</div>
                  {f.vars.map((v, j) => (
                    <div key={j} style={{
                      display: 'flex', justifyContent: 'space-between', fontSize: 10,
                      fontFamily: 'ui-monospace, monospace', color: '#94a3b8', padding: '1px 0',
                    }}>
                      <span>{v.name}</span>
                      <span style={{ color: v.val !== 'null' ? color : '#475569', fontWeight: 700 }}>{v.val}</span>
                    </div>
                  ))}
                </div>
              ))}
          </Col>

          <Col id="heap" title="힙 (Heap)" sub="new로 만든 인스턴스">
            {heap.length === 0
              ? <div style={{ color: '#475569', fontSize: 10, textAlign: 'center', paddingTop: 16 }}>(비어 있음)</div>
              : heap.map((o, k) => (
                <div key={k} style={{
                  background: '#0f172a', border: `1.5px solid ${color}`, borderRadius: 7,
                  padding: '6px 8px', animation: 'net-fade .4s ease',
                }}>
                  <div style={{ fontSize: 9.5, color: '#64748b', fontFamily: 'ui-monospace, monospace' }}>{o.id}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#e2e8f0' }}>🚗 {o.label}</div>
                </div>
              ))}
          </Col>
        </div>
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} disabled={busy} onClick={run}>프로그램 실행</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
