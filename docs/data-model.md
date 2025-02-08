# データモデル設計

## ユーザー (Users)
- id: UUID
- username: string
- email: string
- password_hash: string
- role: enum (student, teacher, admin)
- created_at: timestamp
- updated_at: timestamp

## 問題 (Questions)
- id: UUID
- title: string
- content: text
- choice1: string
- choice2: string
- choice3: string
- choice4: string
- correct_choice: integer (1-4)
- jlpt_level: integer (1-5)
- category_id: UUID
- created_by: UUID (Users)
- created_at: timestamp
- updated_at: timestamp
- question_type: string  # 追加: 問題タイプ
- mistake_type: string  # 追加: 誤答タイプ

## カテゴリ (Categories)
- id: UUID
- name: string
- description: text
- parent_id: UUID (self)
- created_at: timestamp

## 解答履歴 (AnswerHistory)
- id: UUID
- user_id: UUID (Users)
- question_id: UUID (Questions)
- is_correct: boolean
- answer_time: integer (秒)
- created_at: timestamp

## 学習進捗 (Progress)
- id: UUID
- user_id: UUID (Users)
- category_id: UUID (Categories)
- completed_questions: integer
- accuracy_rate: decimal
- updated_at: timestamp

## セッション (Sessions)
- id: UUID
- user_id: UUID (Users)
- token: string
- expires_at: timestamp
- created_at: timestamp

## システム設定 (Settings)
- key: string
- value: json
- updated_at: timestamp
- updated_by: UUID (Users)

## 練習セット (PracticeSets)  # 追加: 練習セットモデル
- id: UUID
- name: string
- description: text
- created_by: UUID (Users)
- created_at: timestamp
- updated_at: timestamp

## 練習アサイン (PracticeAssignments)  # 追加: 練習アサインモデル
- id: UUID
- practice_set_id: UUID (PracticeSets)
- user_id: UUID (Users)
- assigned_at: timestamp
- due_date: timestamp

## メール通知設定 (NotificationSettings)
- id: UUID
- user_id: UUID (Users)
- email_enabled: boolean
- notification_types: json
- created_at: timestamp
- updated_at: timestamp
