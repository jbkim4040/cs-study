// CS Study — 자료구조 + 운영체제 + 컴퓨터 네트워크 + 객체지향/Java 통합 데이터
import { STRUCTURES, CATEGORIES as DS_CATEGORIES } from './structures.js'
import { TOPICS as OS_TOPICS, CATEGORIES as OS_CATEGORIES } from './os-topics.js'
import { TOPICS as NET_TOPICS, CATEGORIES as NET_CATEGORIES } from './net-topics.js'
import { TOPICS as JAVA_TOPICS, CATEGORIES as JAVA_CATEGORIES } from './java-topics.js'
import { QUIZZES as DS_QUIZZES } from './ds-quizzes.js'
import { QUIZZES as OS_QUIZZES } from './os-quizzes.js'
import { QUIZZES as NET_QUIZZES } from './net-quizzes.js'
import { QUIZZES as JAVA_QUIZZES } from './java-quizzes.js'

export const SUBJECTS = [
  {
    id: 'ds', label: '자료구조', sub: 'Data Structures',
    icon: '⚡', accent: '#6366f1',
    categories: DS_CATEGORIES,
    topics: STRUCTURES,
  },
  {
    id: 'os', label: '운영체제', sub: 'Operating Systems',
    icon: '🖥️', accent: '#10b981',
    categories: OS_CATEGORIES,
    topics: OS_TOPICS,
  },
  {
    id: 'net', label: '컴퓨터 네트워크', sub: 'Computer Networks',
    icon: '🌐', accent: '#0ea5e9', tabLabel: '네트워크',
    categories: NET_CATEGORIES,
    topics: NET_TOPICS,
  },
  {
    id: 'java', label: '객체지향 / Java', sub: 'Object-Oriented Java',
    icon: '☕', accent: '#ea580c', tabLabel: 'Java',
    categories: JAVA_CATEGORIES,
    topics: JAVA_TOPICS,
  },
]

export const ALL_TOPICS = [
  ...STRUCTURES.map(t => ({ ...t, subject: 'ds' })),
  ...OS_TOPICS.map(t => ({ ...t, subject: 'os' })),
  ...NET_TOPICS.map(t => ({ ...t, subject: 'net' })),
  ...JAVA_TOPICS.map(t => ({ ...t, subject: 'java' })),
]

export const TOPIC_BY_ID = Object.fromEntries(ALL_TOPICS.map(t => [t.id, t]))

export const QUIZZES = { ...DS_QUIZZES, ...OS_QUIZZES, ...NET_QUIZZES, ...JAVA_QUIZZES }

// 과목 전체 퀴즈 — 주제마다 2문항 무작위 출제
export function buildFullQuiz(subjectId) {
  const subject = SUBJECTS.find(s => s.id === subjectId)
  const result = []
  for (const topic of subject.topics) {
    const qs = QUIZZES[topic.id] || []
    const picked = [...qs].sort(() => Math.random() - 0.5).slice(0, 2)
    picked.forEach(q => result.push({ ...q, topicId: topic.id }))
  }
  return result.sort(() => Math.random() - 0.5)
}
