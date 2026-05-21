import { useState } from 'react'
import Quiz from './Quiz.jsx'
import { buildFullQuiz, SUBJECTS } from '../data/subjects.js'

export default function FullQuiz({ subject, onBack, recordScore }) {
  const [questions] = useState(() => buildFullQuiz(subject))
  const subj = SUBJECTS.find(s => s.id === subject)

  return (
    <div className="ds-page" style={{ '--color': subj.accent }}>
      <header className="ds-hero" style={{ '--color': subj.accent }}>
        <span className="ds-hero-emoji">🎯</span>
        <div className="ds-hero-text">
          <span className="ds-hero-cat">종합 평가</span>
          <div className="ds-hero-titles">
            <h1 className="ds-hero-title">{subj.label} 전체 퀴즈</h1>
            <span className="ds-hero-sub">{subj.sub} Quiz</span>
          </div>
          <p className="ds-hero-tagline">
            {subj.label} {subj.topics.length}개 주제에서 무작위로 출제된 {questions.length}문제 —
            실력을 한 번에 점검해보세요!
          </p>
        </div>
      </header>

      <section className="section">
        <div className="full-quiz-info">
          {subj.topics.map(t => <span key={t.id}>{t.emoji} {t.name}</span>)}
        </div>
        <Quiz
          questions={questions}
          color={subj.accent}
          showTopicLabel
          onComplete={(score, total) =>
            recordScore?.('__full_' + subject, Math.round((score / total) * 100))
          }
        />
      </section>

      <div className="back-row">
        <button className="back-btn" onClick={onBack}>← 주제 목록으로</button>
      </div>
    </div>
  )
}
