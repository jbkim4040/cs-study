import { useState, useRef } from 'react'

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
const STEP_DELAY  = 380   // ms per JS step

const STARTERS = {
  javascript: 'console.log("Hello, World!");\n\nfor (let i = 1; i <= 5; i++) {\n  console.log("i =", i);\n}',
  python:     'print("Hello, World!")\n\nfor i in range(1, 6):\n    print("i =", i)',
}

// Inject `await __step(N)` before each executable line; asyncify function declarations
function injectSteps(src) {
  const code = src
    .replace(/(?<![.\w])function(\s+\w+\s*\()/g, 'async function$1')
    .replace(/(?<![.\w])function\s*\(/g, 'async function(')
  return code.split('\n').map((line, i) => {
    const t = line.trim()
    if (!t) return line
    if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return line
    if (/^(else|catch|finally)[\s({]/.test(t) || /^[}\]]+/.test(t)) return line
    return `await __step(${i + 1}); ${line}`
  }).join('\n')
}

// Async worker — streams { type:'line', n } then { type:'done', ok, output, error }
const ANIMATED_WORKER = `
self.onmessage = async function(e) {
  var logs = [];
  var fmt = function(v) {
    if (v !== null && typeof v === 'object') { try { return JSON.stringify(v); } catch (_) { return String(v); } }
    return String(v);
  };
  var cons = {
    log:   function() { logs.push([].map.call(arguments, fmt).join(' ')); },
    error: function() { logs.push([].map.call(arguments, fmt).join(' ')); },
    warn:  function() { logs.push([].map.call(arguments, fmt).join(' ')); },
    info:  function() { logs.push([].map.call(arguments, fmt).join(' ')); }
  };
  var __step = async function(n) {
    self.postMessage({ type: 'line', n: n });
    await new Promise(function(r) { setTimeout(r, e.data.delay); });
  };
  try {
    var fn = new Function('console', '__step',
      '"use strict"; return (async function() {\\n' + e.data.code + '\\n})()');
    await fn(cons, __step);
    self.postMessage({ type: 'done', ok: true, output: logs.join('\\n') });
  } catch (err) {
    self.postMessage({ type: 'done', ok: false, output: logs.join('\\n'), error: String(err) });
  }
};
`

// Fast worker — no animation
const FAST_WORKER = `
self.onmessage = function(e) {
  var logs = [];
  var fmt = function(v) {
    if (v !== null && typeof v === 'object') { try { return JSON.stringify(v); } catch (_) { return String(v); } }
    return String(v);
  };
  var s = {
    log:   function() { logs.push([].map.call(arguments, fmt).join(' ')); },
    error: function() { logs.push([].map.call(arguments, fmt).join(' ')); },
    warn:  function() { logs.push([].map.call(arguments, fmt).join(' ')); },
    info:  function() { logs.push([].map.call(arguments, fmt).join(' ')); }
  };
  try {
    new Function('console', e.data.code)(s);
    self.postMessage({ ok: true, output: logs.join('\\n') });
  } catch (err) {
    self.postMessage({ ok: false, output: logs.join('\\n'), error: String(err) });
  }
};
`

function spawnWorker(src) {
  return new Worker(URL.createObjectURL(new Blob([src], { type: 'application/javascript' })))
}

function runJSFast(code) {
  return new Promise(resolve => {
    let w
    try { w = spawnWorker(FAST_WORKER) } catch (e) { resolve({ ok: false, output: '', error: String(e) }); return }
    const t = setTimeout(() => { w.terminate(); resolve({ ok: false, output: '', error: '시간 초과 (3초)' }) }, 3000)
    w.onmessage = ev => { clearTimeout(t); w.terminate(); resolve(ev.data) }
    w.onerror   = ev => { clearTimeout(t); w.terminate(); resolve({ ok: false, output: '', error: String(ev.message) }) }
    w.postMessage({ code })
  })
}

function runJSAnimated(code, delay, onLine) {
  return new Promise(resolve => {
    let w
    try { w = spawnWorker(ANIMATED_WORKER) } catch (e) { resolve({ ok: false, output: '', error: String(e) }); return }
    const t = setTimeout(() => { w.terminate(); resolve({ ok: false, output: '', error: '시간 초과 (20초)' }) }, 20000)
    w.onmessage = ev => {
      if (ev.data.type === 'line') { onLine(ev.data.n); return }
      clearTimeout(t); w.terminate(); resolve(ev.data)
    }
    w.onerror = ev => { clearTimeout(t); w.terminate(); resolve({ ok: false, output: '', error: String(ev.message) }) }
    w.postMessage({ code: injectSteps(code), delay })
  })
}

export default function CodePlayground({ starterCode, starterLang, color }) {
  const initLang = starterLang === 'python' ? 'python' : 'javascript'
  const [lang, setLang]       = useState(initLang)
  const [code, setCode]       = useState(starterCode || STARTERS[initLang])
  const [output, setOutput]   = useState('')
  const [status, setStatus]   = useState('idle')
  const [running, setRunning] = useState(false)
  const [hlLine, setHlLine]   = useState(null)
  const [stepMode, setStepMode] = useState(true)
  const pyRef = useRef(null)

  async function ensurePyodide() {
    if (pyRef.current) return pyRef.current
    setOutput('Python 런타임을 불러오는 중… (최초 1회, 수 초 소요)')
    const mod = await import(/* @vite-ignore */ PYODIDE_URL + 'pyodide.mjs')
    const py  = await mod.loadPyodide({ indexURL: PYODIDE_URL })
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
    setRunning(true); setStatus('running'); setOutput('실행 중…'); setHlLine(null)

    let result
    if (stepMode && lang === 'javascript') {
      result = await runJSAnimated(code, STEP_DELAY, n => setHlLine(n))
    } else if (lang === 'python') {
      result = await runPython(code)
    } else {
      result = await runJSFast(code)
    }

    setHlLine(null)
    let text = result.output || ''
    if (result.error) text += (text ? '\n' : '') + '⚠ ' + result.error
    setOutput(text || '(출력 없음)')
    setStatus(result.ok ? 'ok' : 'error')
    setRunning(false)
  }

  function changeLang(l) {
    setLang(l); setCode(STARTERS[l]); setOutput(''); setStatus('idle'); setHlLine(null)
  }

  function reset() {
    setCode(lang === initLang ? (starterCode || STARTERS[lang]) : STARTERS[lang])
    setOutput(''); setStatus('idle'); setHlLine(null)
  }

  function onKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const t = e.target, s = t.selectionStart, en = t.selectionEnd
      setCode(code.slice(0, s) + '  ' + code.slice(en))
      requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 2 })
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!running) run()
    }
  }

  const lines = code.split('\n')
  const showExecView = running && stepMode && lang === 'javascript'

  return (
    <div className="pg" style={{ '--color': color }}>
      <div className="pg-hint">
        <span className="pg-hint-step">① 아래 코드 수정</span>
        <span className="pg-hint-arrow">→</span>
        <span className="pg-hint-step">② <strong>▶ 실행</strong> 또는 <kbd>Ctrl+Enter</kbd></span>
        <span className="pg-hint-arrow">→</span>
        <span className="pg-hint-step">③ <strong>실행 흐름 보기</strong> 켜면 줄별 강조</span>
      </div>
      <div className="pg-bar">
        <select className="lang-select" value={lang} onChange={e => changeLang(e.target.value)} aria-label="실행 언어 선택">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <div className="pg-bar-right">
          <label className="pg-step-toggle" title="JavaScript 실행 시 현재 줄을 순서대로 강조합니다 (Python 미지원)">
            <input type="checkbox" checked={stepMode} onChange={e => setStepMode(e.target.checked)} disabled={running} />
            실행 흐름 보기
          </label>
          <button className="pg-reset" onClick={reset} disabled={running}>초기화</button>
          <button className="pg-run" onClick={run} disabled={running}>{running ? '실행 중…' : '▶ 실행'}</button>
        </div>
      </div>

      <div className="pg-code-wrap">
        <div className="pg-gutter" aria-hidden="true">
          {lines.map((_, i) => (
            <div key={i} className={'pg-ln' + (hlLine === i + 1 ? ' hl' : '')}>{i + 1}</div>
          ))}
        </div>

        {showExecView ? (
          <pre className="pg-exec-view">
            {lines.map((ln, i) => (
              <div key={i} className={'pg-exec-ln' + (hlLine === i + 1 ? ' hl' : '')}>
                {ln || ' '}
              </div>
            ))}
          </pre>
        ) : (
          <textarea
            className="pg-editor"
            value={code}
            spellCheck={false}
            onChange={e => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="코드 편집기"
          />
        )}
      </div>

      <div className={'pg-output ' + status}>
        <div className="pg-output-label">
          출력
          {running && hlLine && <span className="pg-tag run-tag">{hlLine}번째 줄 실행 중</span>}
          {!running && status === 'ok'    && <span className="pg-tag ok">성공</span>}
          {!running && status === 'error' && <span className="pg-tag err">오류</span>}
        </div>
        <pre>{output || '코드를 수정하거나 그대로 ▶ 실행해 보세요.'}</pre>
      </div>
    </div>
  )
}
