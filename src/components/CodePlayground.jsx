import { useState, useRef, useEffect } from 'react'

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
const STEP_DELAY  = 380   // ms per JS step

const STARTERS = {
  javascript: 'console.log("Hello, World!");\n\nfor (let i = 1; i <= 5; i++) {\n  console.log("i =", i);\n}',
  python:     'print("Hello, World!")\n\nfor i in range(1, 6):\n    print("i =", i)',
}

// Strip local file paths and blob URLs from error messages before showing to users
function sanitizeError(raw) {
  return String(raw)
    .replace(/(?:\/(?:Users|home|var|tmp|private|root)|[A-Za-z]:\\)[^\s"')]+/g, '<path>')
    .replace(/blob:https?:\/\/[^\s)]+/g, '<worker>')
    .replace(/file:\/\/[^\s)]+/g, '<path>')
    .replace(/^Uncaught\s+/, '')
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
    new Function('console', 'self', '"use strict";\n' + e.data.code)(s, undefined);
    self.postMessage({ ok: true, output: logs.join('\\n') });
  } catch (err) {
    self.postMessage({ ok: false, output: logs.join('\\n'), error: String(err) });
  }
};
`

// Bridge code snippets — injected at worker global scope to expose a `viz` API
const VIZ_BRIDGES = {
  stack: `
var __vs = [];
var viz = {
  push: async function(x) {
    __vs.push(x);
    self.postMessage({ type: 'viz-op', op: 'push', args: [x] });
    await new Promise(function(r) { setTimeout(r, 420); });
    return x;
  },
  pop: async function() {
    var v = __vs.length > 0 ? __vs[__vs.length - 1] : undefined;
    if (__vs.length > 0) __vs.pop();
    self.postMessage({ type: 'viz-op', op: 'pop', args: [] });
    await new Promise(function(r) { setTimeout(r, 420); });
    return v;
  },
  peek: function() { return __vs.length > 0 ? __vs[__vs.length - 1] : undefined; },
  size: function() { return __vs.length; },
  isEmpty: function() { return __vs.length === 0; },
  reset: async function() {
    __vs = [];
    self.postMessage({ type: 'viz-op', op: 'reset', args: [] });
    await new Promise(function(r) { setTimeout(r, 200); });
  }
};`,
  queue: `
var __vq = [];
var viz = {
  enqueue: async function(x) {
    __vq.push(x);
    self.postMessage({ type: 'viz-op', op: 'enqueue', args: [x] });
    await new Promise(function(r) { setTimeout(r, 420); });
    return x;
  },
  dequeue: async function() {
    var v = __vq.length > 0 ? __vq[0] : undefined;
    if (__vq.length > 0) __vq.shift();
    self.postMessage({ type: 'viz-op', op: 'dequeue', args: [] });
    await new Promise(function(r) { setTimeout(r, 420); });
    return v;
  },
  peek: function() { return __vq.length > 0 ? { front: __vq[0], rear: __vq[__vq.length - 1] } : null; },
  size: function() { return __vq.length; },
  isEmpty: function() { return __vq.length === 0; },
  reset: async function() {
    __vq = [];
    self.postMessage({ type: 'viz-op', op: 'reset', args: [] });
    await new Promise(function(r) { setTimeout(r, 200); });
  }
};`,
}

function buildAnimatedWorker(bridgeCode) {
  return (bridgeCode || '') + `
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
}

function spawnWorker(src) {
  return new Worker(URL.createObjectURL(new Blob([src], { type: 'application/javascript' })))
}

function runJSFast(code) {
  return new Promise(resolve => {
    let w
    try { w = spawnWorker(FAST_WORKER) } catch { resolve({ ok: false, output: '', error: '코드 실행 환경을 초기화하지 못했습니다.' }); return }
    const t = setTimeout(() => { w.terminate(); resolve({ ok: false, output: '', error: '시간 초과 (3초)' }) }, 3000)
    w.onmessage = ev => { clearTimeout(t); w.terminate(); resolve(ev.data) }
    w.onerror   = ev => { clearTimeout(t); w.terminate(); resolve({ ok: false, output: '', error: sanitizeError(ev.message) }) }
    w.postMessage({ code })
  })
}

function runJSAnimated(code, delay, onLine, onVizOp, bridgeCode) {
  return new Promise(resolve => {
    let w
    const workerSrc = bridgeCode ? buildAnimatedWorker(bridgeCode) : ANIMATED_WORKER
    try { w = spawnWorker(workerSrc) } catch { resolve({ ok: false, output: '', error: '코드 실행 환경을 초기화하지 못했습니다.' }); return }
    const t = setTimeout(() => { w.terminate(); resolve({ ok: false, output: '', error: '시간 초과 (20초)' }) }, 20000)
    w.onmessage = ev => {
      if (ev.data.type === 'line') { onLine(ev.data.n); return }
      if (ev.data.type === 'viz-op') { onVizOp?.(ev.data.op, ev.data.args); return }
      clearTimeout(t); w.terminate(); resolve(ev.data)
    }
    w.onerror = ev => { clearTimeout(t); w.terminate(); resolve({ ok: false, output: '', error: sanitizeError(ev.message) }) }
    w.postMessage({ code: injectSteps(code), delay })
  })
}

export default function CodePlayground({ starterCode, starterLang, color, vizBridge, onVizOp, externalHlLine }) {
  const initLang = starterLang === 'python' ? 'python' : 'javascript'
  const [lang, setLang]       = useState(initLang)
  const [code, setCode]       = useState(starterCode || STARTERS[initLang])
  const [output, setOutput]   = useState('')
  const [status, setStatus]   = useState('idle')
  const [running, setRunning] = useState(false)
  const [hlLine, setHlLine]   = useState(null)
  const [stepMode, setStepMode] = useState(true)
  const [fromVizHl, setFromVizHl] = useState(null)
  const pyRef = useRef(null)
  const execViewRef = useRef(null)

  useEffect(() => {
    if (!externalHlLine) return
    setFromVizHl(externalHlLine)
    const t = setTimeout(() => setFromVizHl(null), 1200)
    return () => clearTimeout(t)
  }, [externalHlLine])

  useEffect(() => {
    if (!hlLine || !execViewRef.current) return
    const el = execViewRef.current.children[hlLine - 1]
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [hlLine])

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
      py.setStderr({ batched: () => {} })  // discard Pyodide internal warnings
      await py.runPythonAsync(src)
      return { ok: true, output: out.replace(/\n$/, '') }
    } catch (err) {
      return { ok: false, output: '', error: sanitizeError(err) }
    }
  }

  async function run() {
    setRunning(true); setStatus('running'); setOutput('실행 중…'); setHlLine(null)

    let result
    if ((stepMode || vizBridge) && lang === 'javascript') {
      result = await runJSAnimated(code, STEP_DELAY, n => setHlLine(n), onVizOp, vizBridge ? VIZ_BRIDGES[vizBridge] : null)
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
            <div key={i} className={'pg-ln' + (hlLine === i + 1 ? ' hl' : '') + (fromVizHl === i + 1 ? ' viz-hl' : '')}>{i + 1}</div>
          ))}
        </div>

        {showExecView ? (
          <pre className="pg-exec-view" ref={execViewRef}>
            {lines.map((ln, i) => (
              <div key={i} className={'pg-exec-ln' + (hlLine === i + 1 ? ' hl' : '') + (fromVizHl === i + 1 ? ' viz-hl' : '')}>
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
