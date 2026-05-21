import { useState } from 'react'

const INIT_CELLS = [
  { addr: '0x100', name: 'x', value: 42, type: 'int' },
  { addr: '0x104', name: 'y', value: 99, type: 'int' },
  { addr: '0x108', name: '', value: '...', type: '' },
  { addr: '0x110', name: 'ptr', value: '0x100', type: 'int*', isPtr: true },
  { addr: '0x118', name: 'null_ptr', value: 'NULL', type: 'int*', isPtr: true, isNull: true },
]

export default function PointerViz({ color }) {
  const [cells, setCells] = useState(INIT_CELLS)
  const [pointed, setPointed] = useState('0x100')
  const [log, setLog] = useState('ptr은 0x100 (변수 x)을 가리키고 있습니다.')
  const [derefResult, setDerefResult] = useState(null)

  function deref() {
    const target = cells.find(c => c.addr === pointed)
    if (!target) { setLog('⚠️ 유효하지 않은 주소입니다.'); return }
    setDerefResult(target.value)
    setLog(`*ptr = ${target.value}  ← 주소 ${pointed}에 저장된 값`)
    setTimeout(() => setDerefResult(null), 2000)
  }

  function redirectPtr(addr) {
    const target = cells.find(c => c.addr === addr)
    if (!target || target.isPtr) { setLog('⚠️ 포인터를 가리킬 수 없습니다.'); return }
    setPointed(addr)
    setCells(cs => cs.map(c => c.name === 'ptr' ? { ...c, value: addr } : c))
    setLog(`ptr = ${addr}  →  이제 변수 ${target.name}(${target.value})을 가리킵니다.`)
  }

  function changeValue(addr, newVal) {
    setCells(cs => cs.map(c => c.addr === addr ? { ...c, value: Number(newVal) || newVal } : c))
    if (addr === pointed) {
      setLog(`*ptr이 가리키는 값이 ${newVal}로 변경됨 — ptr(${pointed})을 통해 x가 바뀝니다.`)
    }
  }

  return (
    <div className="viz">
      <div className="ptr-memory">
        <div className="ptr-mem-header">
          <span>메모리 주소</span><span>변수명</span><span>저장값</span><span>자료형</span>
        </div>
        {cells.map(cell => (
          <div
            key={cell.addr}
            className={
              'ptr-cell' +
              (cell.addr === pointed ? ' is-pointed' : '') +
              (cell.isPtr ? ' is-ptr' : '') +
              (cell.isNull ? ' is-null' : '')
            }
            style={cell.addr === pointed ? { '--c': color } : {}}
          >
            <span className="ptr-addr">{cell.addr}</span>
            <span className="ptr-name">{cell.name || '—'}</span>
            <span className="ptr-val">
              {cell.isPtr && !cell.isNull
                ? <button className="ptr-addr-btn" style={{ '--c': color }} onClick={() => redirectPtr(cell.value)}>{cell.value}</button>
                : cell.value
              }
            </span>
            <span className="ptr-type">{cell.type || '—'}</span>
            {cell.addr === pointed && (
              <span className="ptr-arrow" style={{ color }}>← ptr</span>
            )}
          </div>
        ))}
      </div>

      {derefResult !== null && (
        <div className="ptr-deref-result" style={{ '--c': color }}>
          <strong>*ptr</strong> = <span>{derefResult}</span>
        </div>
      )}

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': color }} onClick={deref}>
            역참조 (*ptr)
          </button>
          <button className="viz-btn" style={{ '--c': '#64748b' }} onClick={() => {
            setPointed('0x100')
            setCells(INIT_CELLS)
            setLog('초기화 완료. ptr은 0x100 (x)을 가리킵니다.')
          }}>초기화</button>
        </div>
        <p className="viz-hint">주소 버튼을 클릭하면 ptr이 해당 변수를 가리킵니다.</p>
      </div>
    </div>
  )
}
