import { useState, useRef } from 'react'

// JS는 Web Worker에서 격리 실행(타임아웃), Python은 Pyodide(WASM)로 브라우저 안에서 실행
const WORKER_SRC = `
self.onmessage = function (e) {
  var logs = [];
  function fmt(v) {
    if (typeof v === 'object' && v !== null) { try { return JSON.stringify(v); } catch (_) { return String(v); } }
    return String(v);
  }
  var sandbox = {
    log:   function () { logs.push([].map.call(arguments, fmt).join(' ')); },
    error: function () { logs.push([].map.call(arguments, fmt).join(' ')); },
    warn:  function () { logs.push([].map.call(arguments, fmt).join(' ')); },
    info:  function () { logs.push([].map.call(arguments, fmt).join(' ')); }
  };
  try {
    var fn = new Function('console', e.data.code);
    fn(sandbox);
    self.postMessage({ ok: true, output: logs.join('\\n') });
  } catch (err) {
    self.postMessage({ ok: false, output: logs.join('\\n'), error: String(err) });
  }
};
`

const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'

const STARTERS = {
  javascript: 'console.log("Hello, World!");\n\nfor (let i = 1; i <= 5; i++) {\n  console.log("i =", i);\n}',
  python: 'print("Hello, World!")\n\nfor i in range(1, 6):\n    print("i =", i)',
}

function runJS(code) {
  return new Promise(resolve => {
    let worker
    try {
      const blob = new Blob([WORKER_SRC], { type: 'application/javascript' })
      worker = new Worker(URL.createObjectURL(blob))
    } catch (e) {
      resolve({ ok: false, output: '', error: 'Worker 생성 실패: ' + e })
      return
    }
    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ ok: false, output: '', error: '시간 초과 (3초) — 무한 루프가 있는지 확인하세요.' })
    }, 3000)
    worker.onmessage = ev => { clearTimeout(timer); worker.terminate(); resolve(ev.data) }
    worker.onerror = ev => { clearTimeout(timer); worker.terminate(); resolve({ ok: false, output: '', error: String(ev.message || 'Worker 오류') }) }
    worker.postMessage({ code })
  })
}

export default function CodePlayground({ starterCode, starterLang, color }) {
  const initLang = starterLang === 'python' ? 'python' : 'javascript'
  const [lang, setLang] = useState(initLang)
  const [code, setCode] = useState(starterCode || STARTERS[initLang])
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState('idle')   // idle | running | ok | error
  const [running, setRunning] = useState(false)
  const pyRef = useRef(null)

  async function ensurePyodide() {
    if (pyRef.current) return pyRef.current
    setOutput('Python 런타임을 불러오는 중… (최초 1회, 수 초 소요)')
    const mod = await import(/* @vite-ignore */ PYODIDE + 'pyodide.mjs')
    const py = await mod.loadPyodide({ indexURL: PYODIDE })
    pyRef.current = py
    return py
  }

  async function runPython(src) {
    try {
      const py = await ensurePyodide()
      let out = ''
      py.setStdout({ batched: s => { out += s + '\n' } })
      py.setStderr({ batched: s => { out += s + '\n' } })
      await py.runPythonAsync(src)
      return { ok: true, output: out.replace(/\n$/, '') }
    } catch (err) {
      return { ok: false, output: '', error: String(err) }
    }
  }

  async function run() {
    setRunning(true); setStatus('running'); setOutput('실행 중…')
    const result = lang === 'python' ? await runPython(code) : await runJS(code)
    let text = result.output || ''
    if (result.error) text += (text ? '\n' : '') + '⚠ ' + result.error
    setOutput(text || '(출력 없음)')
    setStatus(result.ok ? 'ok' : 'error')
    setRunning(false)
  }

  function changeLang(l) {
    setLang(l)
    setCode(STARTERS[l])
    setOutput(''); setStatus('idle')
  }

  function reset() {
    setCode(lang === initLang ? (starterCode || STARTERS[lang]) : STARTERS[lang])
    setOutput(''); setStatus('idle')
  }

  function onKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const t = e.target
      const s = t.selectionStart, en = t.selectionEnd
      setCode(code.slice(0, s) + '  ' + code.slice(en))
      requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 2 })
    }
  }

  return (
    <div className="pg" style={{ '--color': color }}>
      <div className="pg-bar">
        <select className="lang-select" value={lang} onChange={e => changeLang(e.target.value)} aria-label="실행 언어 선택">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <div className="pg-bar-right">
          <button className="pg-reset" onClick={reset} disabled={running}>초기화</button>
          <button className="pg-run" onClick={run} disabled={running}>{running ? '실행 중…' : '▶ 실행'}</button>
        </div>
      </div>
      <textarea
        className="pg-editor"
        value={code}
        spellCheck={false}
        onChange={e => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="코드 편집기"
      />
      <div className={'pg-output ' + status}>
        <div className="pg-output-label">
          출력
          {status === 'ok' && <span className="pg-tag ok">성공</span>}
          {status === 'error' && <span className="pg-tag err">오류</span>}
        </div>
        <pre>{output || '코드를 작성하고 ▶ 실행을 누르세요.'}</pre>
      </div>
    </div>
  )
}
