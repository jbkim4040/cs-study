import { Fragment } from 'react'

// **굵게** 마크업 + 키워드 호버 툴팁을 렌더한다.
// glossary: { map, regex } | null  (null이면 키워드 처리 없이 굵게만)
export default function RichText({ text, glossary }) {
  const segs = String(text).split(/\*\*(.+?)\*\*/)
  return segs.map((seg, i) => {
    const isBold = i % 2 === 1
    let content = seg
    if (glossary && glossary.regex) {
      const parts = seg.split(glossary.regex)
      content = parts.map((p, j) =>
        j % 2 === 1 && glossary.map[p]
          ? (
            <span className="kw" key={j} tabIndex={0}>
              {p}
              <span className="kw-pop" role="tooltip">{glossary.map[p]}</span>
            </span>
          )
          : <Fragment key={j}>{p}</Fragment>
      )
    }
    return isBold
      ? <strong key={i}>{content}</strong>
      : <Fragment key={i}>{content}</Fragment>
  })
}
