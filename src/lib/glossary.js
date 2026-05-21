// 용어(terminology) 배열로부터 키워드 호버 사전을 만든다.
// term 문자열에서 한글 표제어와 괄호 안 영문을 모두 키워드로 추출.

export function extractKeywords(term) {
  const out = []
  const paren = term.match(/\(([^)]+)\)/)
  const main = term.replace(/\([^)]*\)/g, '').trim()
  for (const seg of main.split('/')) {
    const s = seg.trim()
    if (s) out.push(s)
  }
  if (paren) {
    const inner = paren[1].trim()
    if (inner) out.push(inner)
  }
  return out
}

// terminology: [{ term, def }] → { map: {키워드: 정의}, regex } | null
export function buildGlossary(terminology) {
  if (!terminology || !terminology.length) return null
  const map = {}
  for (const { term, def } of terminology) {
    for (const kw of extractKeywords(term)) {
      if (kw.length >= 2 && !(kw in map)) map[kw] = def
    }
  }
  const keys = Object.keys(map).sort((a, b) => b.length - a.length) // 긴 키워드 우선
  if (!keys.length) return null
  const pattern = keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  return { map, regex: new RegExp('(' + pattern + ')') }
}
