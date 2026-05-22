import { useState, useRef, useEffect } from 'react'

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
const STEP_DELAY  = 380   // ms per step in animated mode

const STARTERS = {
  javascript: 'console.log("Hello, World!");\n\nfor (let i = 1; i <= 5; i++) {\n  console.log("i =", i);\n}',
  python:     'print("Hello, World!")\n\nfor i in range(1, 6):\n    print("i =", i)',
}

// Strip local file paths and blob URLs before showing errors to users
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

// Bridge code for viz-synced execution.
// Runs inside the sandboxed iframe via new Function; uses parent.postMessage for viz events.
const VIZ_BRIDGES = {
  stack: `
var __vs = [];
var viz = {
  push: async function(x) {
    __vs.push(x);
    parent.postMessage({ type: 'viz-op', op: 'push', args: [x] }, '*');
    await new Promise(function(r) { setTimeout(r, 420); });
    return x;
  },
  pop: async function() {
    var v = __vs.length > 0 ? __vs[__vs.length - 1] : undefined;
    if (__vs.length > 0) __vs.pop();
    parent.postMessage({ type: 'viz-op', op: 'pop', args: [] }, '*');
    await new Promise(function(r) { setTimeout(r, 420); });
    return v;
  },
  peek:    function() { return __vs.length > 0 ? __vs[__vs.length - 1] : undefined; },
  size:    function() { return __vs.length; },
  isEmpty: function() { return __vs.length === 0; },
  reset: async function() {
    __vs = [];
    parent.postMessage({ type: 'viz-op', op: 'reset', args: [] }, '*');
    await new Promise(function(r) { setTimeout(r, 200); });
  }
};`,
  queue: `
var __vq = [];
var viz = {
  enqueue: async function(x) {
    __vq.push(x);
    parent.postMessage({ type: 'viz-op', op: 'enqueue', args: [x] }, '*');
    await new Promise(function(r) { setTimeout(r, 420); });
    return x;
  },
  dequeue: async function() {
    var v = __vq.length > 0 ? __vq[0] : undefined;
    if (__vq.length > 0) __vq.shift();
    parent.postMessage({ type: 'viz-op', op: 'dequeue', args: [] }, '*');
    await new Promise(function(r) { setTimeout(r, 420); });
    return v;
  },
  peek:    function() { return __vq.length > 0 ? { front: __vq[0], rear: __vq[__vq.length - 1] } : null; },
  size:    function() { return __vq.length; },
  isEmpty: function() { return __vq.length === 0; },
  reset: async function() {
    __vq = [];
    parent.postMessage({ type: 'viz-op', op: 'reset', args: [] }, '*');
    await new Promise(function(r) { setTimeout(r, 200); });
  }
};`,
}

// Script embedded in the sandboxed iframe srcdoc.
// Security model:
//   - iframe sandbox="allow-scripts" (no allow-same-origin) → null origin → blocks same-origin XHR/fetch
//   - All dangerous browser globals are shadowed to undefined via new Function parameters
//   - Bridge code runs in a separate new Function scope, only communicates via parent.postMessage
const SANDBOX_SCRIPT = `
window.addEventListener('message', async function(e) {
  if (!e.data || e.data.type !== 'run') return;
  var logs = [];
  var fmt = function(v) {
    if (v !== null && typeof v === 'object') { try { return JSON.stringify(v); } catch(_) { return String(v); } }
    return String(v);
  };
  var cons = {
    log:   function() { logs.push([].map.call(arguments, fmt).join(' ')); },
    error: function() { logs.push([].map.call(arguments, fmt).join(' ')); },
    warn:  function() { logs.push([].map.call(arguments, fmt).join(' ')); },
    info:  function() { logs.push([].map.call(arguments, fmt).join(' ')); }
  };
  var __step = async function(n) {
    parent.postMessage({ type: 'line', n: n }, '*');
    await new Promise(function(r) { setTimeout(r, e.data.delay || 0); });
  };
  var viz = e.data.bridgeCode
    ? new Function(e.data.bridgeCode + '; return viz;')()
    : undefined;
  var _b = undefined;
  try {
    var fn = new Function(
      'console', '__step', 'viz',
      'window', 'document', 'location', 'history', 'navigator',
      'parent', 'top', 'frames', 'opener', 'self', 'globalThis',
      'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'Worker',
      'open', 'alert', 'confirm', 'prompt', 'importScripts',
      'eval', 'Function',
      '"use strict"; return (async function() {\\n' + e.data.code + '\\n})()');
    await fn(
      cons, __step, viz,
      _b, _b, _b, _b, _b,
      _b, _b, _b, _b, _b, _b,
      _b, _b, _b, _b, _b,
      _b, _b, _b, _b, _b,
      _b, _b);
    parent.postMessage({ type: 'done', ok: true, output: logs.join('\\n') }, '*');
  } catch(err) {
    parent.postMessage({ type: 'done', ok: false, output: logs.join('\\n'), error: String(err.message || err) }, '*');
  }
});
`
// Avoid </script> in the literal by splitting the closing tag
const SANDBOX_SRCDOC = '<!DOCTYPE html><html><body><script>' + SANDBOX_SCRIPT + '</' + 'script></body></html>'

// Run JavaScript in an isolated sandbox iframe.
// iframe is created per-run and removed on completion or timeout.
// Sync infinite loops are killed when the parent times out and removes the iframe.
function runJS(code, { delay = 0, onLine, onVizOp, bridgeCode, timeout = 20000 }) {
  return new Promise(resolve => {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.style.cssText = 'display:none;position:absolute;width:0;height:0;border:none'
    iframe.srcdoc = SANDBOX_SRCDOC
    document.body.appendChild(iframe)

    const onMsg = ev => {
      if (ev.source !== iframe.contentWindow) return
      const d = ev.data
      if (d.type === 'line') { onLine?.(d.n); return }
      if (d.type === 'viz-op') { onVizOp?.(d.op, d.args); return }
      if (d.type === 'done') {
        clearTimeout(t)
        cleanup()
        resolve({ ...d, error: d.error ? sanitizeError(d.error) : undefined })
      }
    }
    window.addEventListener('message', onMsg)

    function cleanup() {
      window.removeEventListener('message', onMsg)
      iframe.remove()
    }

    const t = setTimeout(() => {
      cleanup()
      resolve({ ok: false, output: '', error: '시간 초과 (20초) — 무한루프가 있는지 확인하세요.' })
    }, timeout)

    iframe.onload = () => {
      iframe.contentWindow.postMessage({
        type: 'run',
        code: (delay > 0 || bridgeCode) ? injectSteps(code) : code,
        delay,
        bridgeCode: bridgeCode || null,
      }, '*')
    }
  })
}

export default function CodePlayground({ starterCode, starterLang, color, vizBridge, onVizOp, externalHlLine }) {
  const initLang = starterLang === 'python' ? 'python' : 'javascript'
  const [lang, setLang]         = useState(initLang)
  const [code, setCode]         = useState(starterCode || STARTERS[initLang])
  const [output, setOutput]     = useState('')
  const [status, setStatus]     = useState('idle')
  const [running, setRunning]   = useState(false)
  const [hlLine, setHlLine]     = useState(null)
  const [stepMode, setStepMode] = useState(true)
  const [fromVizHl, setFromVizHl] = useState(null)
  const pyRef      = useRef(null)
  const execViewRef = useRef(null)

  useEffect(() => {
    if (!externalHlLine) return
    setFromVizHl(externalHlLine)
    const t = setTimeout(() => setFromVizHl(null), 1200)
    return () => clearTimeout(t)
  }, [externalHlLine])

  useEffect(() => {
    if (!hlLine || !execViewRef.current) return
    execViewRef.current.children[hlLine - 1]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
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
      py.setStderr({ batched: () => {} })
      await py.runPythonAsync(src)
      return { ok: true, output: out.replace(/\n$/, '') }
    } catch (err) {
      return { ok: false, output: '', error: sanitizeError(err) }
    }
  }

  async function run() {
    setRunning(true); setStatus('running'); setOutput('실행 중…'); setHlLine(null)

    let result
    if (lang === 'javascript') {
      const delay = (stepMode || vizBridge) ? STEP_DELAY : 0
      result = await runJS(code, {
        delay,
        onLine:     delay > 0 ? n => setHlLine(n) : undefined,
        onVizOp:    vizBridge ? onVizOp : undefined,
        bridgeCode: vizBridge ? VIZ_BRIDGES[vizBridge] : null,
        timeout:    20000,
      })
    } else {
      result = await runPython(code)
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
                {ln || ' '}
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
