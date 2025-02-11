export interface User {
  id: string
  email: string
  password_hash: string
  role: 'teacher' | 'student'
  created_at: string
}

export interface Question {
  id: string
  category: 'kanji' | 'vocab' | 'grammar'
  level: number
  question: string
  options: string[]
  correct_index: number
  explanation: string | null
  created_at: string
}

export interface QuestionCSV {
  category: string
  level: string
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_index: string
  explanation: string
}

export interface Practice {
  id: string
  student_id: string
  question_ids: string[]
  start_time: string
  end_time: string | null
  is_completed: boolean
}

export interface Answer {
  id: string
  practice_id: string
  question_id: string
  selected_choice: number
  is_correct: boolean
  answered_at: string
}
