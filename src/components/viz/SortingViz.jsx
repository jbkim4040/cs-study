import { useState, useRef } from 'react'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const INIT = [64, 25, 12, 22, 11]

export default function SortingViz({ color }) {
  const [arr, setArr] = useState(INIT)
  const [hl, setHl] = useState({})
  const [sorted, setSorted] = useState(new Set())
  const [log, setLog] = useState('정렬 알고리즘을 선택해 직접 실행해보세요.')
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(false)
  const [customInput, setCustomInput] = useState('')

  function reset() {
    abortRef.current = true
    setTimeout(() => { abortRef.current = false; setArr(INIT); setHl({}); setSorted(new Set()); setLog('초기화됨'); setBusy(false) }, 50)
  }

  function applyCustom() {
    const vals = customInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0 && n <= 200)
    if (vals.length < 2 || vals.length > 10) { setLog('⚠️ 2~10개 숫자 입력 (1~200)'); return }
    setArr(vals); setHl({}); setSorted(new Set()); setLog(`커스텀 배열 적용: [${vals.join(', ')}]`)
  }

  async function bubbleSort() {
    setBusy(true); abortRef.current = false
    let a = [...arr]; const n = a.length; setSorted(new Set())
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (abortRef.current) { setBusy(false); return }
        setHl({ [j]: 'compare', [j + 1]: 'compare' })
        setLog(`비교: a[${j}]=${a[j]} vs a[${j+1}]=${a[j+1]}`)
        await sleep(300)
        if (a[j] > a[j + 1]) {
          ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
          setArr([...a]); setHl({ [j]: 'swap', [j + 1]: 'swap' }); await sleep(200)
        }
      }
      setSorted(s => new Set([...s, n - 1 - i]))
    }
    setSorted(new Set(Array.from({ length: n }, (_, i) => i)))
    setHl({}); setLog('버블 정렬 완료 — O(n²)'); setBusy(false)
  }

  async function selectionSort() {
    setBusy(true); abortRef.current = false
    let a = [...arr]; const n = a.length; setSorted(new Set())
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      for (let j = i + 1; j < n; j++) {
        if (abortRef.current) { setBusy(false); return }
        setHl({ [i]: 'pivot', [j]: 'compare', [minIdx]: 'min' })
        setLog(`최솟값 탐색: min=a[${minIdx}]=${a[minIdx]}, 확인 a[${j}]=${a[j]}`)
        await sleep(280)
        if (a[j] < a[minIdx]) minIdx = j
      }
      if (minIdx !== i) {
        ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
        setArr([...a]); setHl({ [i]: 'swap', [minIdx]: 'swap' }); await sleep(250)
      }
      setSorted(s => new Set([...s, i]))
    }
    setSorted(new Set(Array.from({ length: n }, (_, i) => i)))
    setHl({}); setLog('선택 정렬 완료 — O(n²)'); setBusy(false)
  }

  async function insertionSort() {
    setBusy(true); abortRef.current = false
    let a = [...arr]; const n = a.length; setSorted(new Set([0]))
    for (let i = 1; i < n; i++) {
      if (abortRef.current) { setBusy(false); return }
      const key = a[i]; let j = i - 1
      setHl({ [i]: 'key' }); setLog(`key = a[${i}] = ${key}  삽입 위치 탐색…`)
      await sleep(350)
      while (j >= 0 && a[j] > key) {
        if (abortRef.current) { setBusy(false); return }
        a[j + 1] = a[j]
        setArr([...a]); setHl({ [j]: 'compare', [j + 1]: 'shift' }); setLog(`a[${j}]=${a[j]} > key=${key} → 오른쪽 이동`)
        await sleep(280)
        j--
      }
      a[j + 1] = key
      setArr([...a]); setSorted(s => new Set([...s, j + 1]))
      setHl({ [j + 1]: 'inserted' }); setLog(`key=${key} → 인덱스 ${j + 1}에 삽입`)
      await sleep(300)
    }
    setSorted(new Set(Array.from({ length: n }, (_, i) => i)))
    setHl({}); setLog('삽입 정렬 완료 — O(n²)'); setBusy(false)
  }

  async function quickSort() {
    setBusy(true); abortRef.current = false
    let a = [...arr]; setSorted(new Set())

    async function partition(lo, hi) {
      const pivot = a[hi]; let i = lo
      setHl({ [hi]: 'pivot' }); setLog(`피벗: a[${hi}]=${pivot}`)
      await sleep(350)
      for (let j = lo; j < hi; j++) {
        if (abortRef.current) return i
        setHl({ [hi]: 'pivot', [j]: 'compare' }); setLog(`a[${j}]=${a[j]} vs 피벗=${pivot}`)
        await sleep(250)
        if (a[j] <= pivot) {
          ;[a[i], a[j]] = [a[j], a[i]]
          setArr([...a]); setHl({ [hi]: 'pivot', [i]: 'swap', [j]: 'swap' }); await sleep(200)
          i++
        }
      }
      ;[a[i], a[hi]] = [a[hi], a[i]]
      setArr([...a]); setHl({ [i]: 'inserted' }); setLog(`피벗 ${pivot} → 인덱스 ${i} 확정`)
      await sleep(300)
      return i
    }

    async function qsort(lo, hi) {
      if (lo >= hi || abortRef.current) return
      const p = await partition(lo, hi)
      setSorted(s => new Set([...s, p]))
      await qsort(lo, p - 1)
      await qsort(p + 1, hi)
    }

    await qsort(0, a.length - 1)
    if (!abortRef.current) {
      setSorted(new Set(Array.from({ length: a.length }, (_, i) => i)))
      setHl({}); setLog('퀵 정렬 완료 — 평균 O(n log n)')
    }
    setBusy(false)
  }

  const maxVal = Math.max(...arr, 1)
  const BAR_COLORS = { compare: '#f59e0b', swap: '#ef4444', pivot: color, key: color, min: '#8b5cf6', shift: '#f97316', inserted: '#10b981' }

  return (
    <div className="viz">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, justifyContent: 'center', height: 160, padding: '0 8px' }}>
        {arr.map((v, i) => {
          const hlType = hl[i]
          const isSorted = sorted.has(i)
          const barColor = hlType ? BAR_COLORS[hlType] : isSorted ? '#10b981' : '#475569'
          const height = Math.max(16, Math.round((v / maxVal) * 140))
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: 64 }}>
              <div style={{ fontSize: 11, color: barColor, fontWeight: 700, marginBottom: 2 }}>{v}</div>
              <div style={{
                width: '100%', height, background: barColor,
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.15s, background 0.15s',
                border: hlType ? `2px solid ${barColor}` : '2px solid transparent',
              }} />
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>[{i}]</div>
            </div>
          )
        })}
      </div>

      <div className="viz-log"><span>{log}</span></div>

      <div className="viz-controls">
        <div className="viz-inputs" style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12 }}>
            커스텀 배열
            <input type="text" placeholder="예: 5,3,8,1,9" value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              className="viz-input" style={{ width: 140 }} />
          </label>
          <button className="viz-btn" style={{ '--c': '#64748b' }} onClick={applyCustom} disabled={busy}>적용</button>
        </div>
        <div className="viz-btns">
          <button className="viz-btn" style={{ '--c': '#f59e0b' }} onClick={bubbleSort} disabled={busy}>버블 O(n²)</button>
          <button className="viz-btn" style={{ '--c': '#8b5cf6' }} onClick={selectionSort} disabled={busy}>선택 O(n²)</button>
          <button className="viz-btn" style={{ '--c': '#3b82f6' }} onClick={insertionSort} disabled={busy}>삽입 O(n²)</button>
          <button className="viz-btn" style={{ '--c': color }} onClick={quickSort} disabled={busy}>퀵 O(n log n)</button>
          <button className="viz-btn reset" onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  )
}
