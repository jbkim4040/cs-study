import { useState } from 'react'
import { ALL_TOPICS } from '../data/subjects.js'

const TOPIC_NAMES = Object.fromEntries(ALL_TOPICS.map(t => [t.id, t.name]))

export default function Quiz({ questions, color = '#6366f1', showTopicLabel = false, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function select(qIdx, optIdx) {
    if (submitted) return
    setAnswers(a => ({ ...a, [qIdx]: optIdx }))
  }

  function submit() {
    if (Object.keys(answers).length < questions.length) {
      alert('모든 문제에 답을 선택해주세요.')
      return
    }
    setSubmitted(true)
    const correct = questions.filter((q, i) => answers[i] === q.answer).length
    onComplete?.(correct, questions.length)
    window.scrollTo({ behavior: 'smooth', top: document.documentElement.scrollHeight })
  }

  function reset() {
    setAnswers({})
    setSubmitted(false)
  }

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.answer).length
    : null

  return (
    <div className="quiz-wrap">
      {questions.map((q, qi) => {
        const chosen = answers[qi]
        const correct = q.answer
        const isCorrect = chosen === correct
        return (
          <div key={qi} className={'quiz-card' + (submitted ? (isCorrect ? ' correct' : ' wrong') : '')}>
            <div className="quiz-q-header">
              <span className="quiz-num" style={{ '--color': color }}>Q{qi + 1}</span>
              {showTopicLabel && q.topicId && (
                <span className="quiz-ds-label">{TOPIC_NAMES[q.topicId]}</span>
              )}
            </div>
            <p className="quiz-question">{q.q}</p>
            <div className="quiz-options">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  className={
                    'quiz-opt' +
                    (chosen === oi ? ' chosen' : '') +
                    (submitted && oi === correct ? ' is-correct' : '') +
                    (submitted && chosen === oi && !isCorrect ? ' is-wrong' : '')
                  }
                  onClick={() => select(qi, oi)}
                >
                  <span className="opt-label">{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </button>
              ))}
            </div>
            {submitted && (
              <div className={'quiz-explanation' + (isCorrect ? ' ok' : ' ng')}>
                <span>{isCorrect ? '✓ 정답!' : `✗ 오답 — 정답: ${q.options[correct]}`}</span>
                <p>{q.explanation}</p>
              </div>
            )}
          </div>
        )
      })}

      <div className="quiz-actions">
        {!submitted ? (
          <button className="quiz-submit" style={{ '--color': color }} onClick={submit}>결과 확인</button>
        ) : (
          <div className="quiz-result-row">
            <div className="quiz-score">
              <span className="score-num" style={{ '--color': color }}>{score}</span>
              <span className="score-denom"> / {questions.length}</span>
              <span className="score-label">
                {score === questions.length ? ' 🎉 만점!' : score >= questions.length * 0.6 ? ' 👍 잘했어요!' : ' 다시 도전해봐요!'}
              </span>
            </div>
            <button className="quiz-retry" onClick={reset}>다시 풀기</button>
          </div>
        )}
      </div>
    </div>
  )
}
