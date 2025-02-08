# データモデル設計

## ユーザー (Users)
- id: integer
- username: string
- email: string
- password_hash: string
- role: enum (student, teacher, admin)
- created_at: timestamp
- updated_at: timestamp

## 問題 (Questions)
- id: integer
- title: string
- content: text
- choice1: string
- choice2: string
- choice3: string
- choice4: string
- correct_choice: integer (1-4)
- jlpt_level: integer (1-5)
- category_id: integer
- created_by: integer (Users)
- created_at: timestamp
- updated_at: timestamp
- question_type: string  # 追加: 問題タイプ
- mistake_type: string  # 追加: 誤答タイプ

## カテゴリ (Categories)
- id: integer
- name: string
- description: text
- parent_id: integer (self)
- created_at: timestamp

## 解答履歴 (AnswerHistory)
- id: integer
- user_id: integer (Users)
- question_id: integer (Questions)
- is_correct: boolean
- answer_time: integer (秒)
- created_at: timestamp

## 学習進捗 (Progress)
- id: integer
- user_id: integer (Users)
- category_id: integer (Categories)
- completed_questions: integer
- accuracy_rate: decimal
- updated_at: timestamp

## セッション (Sessions)
- id: integer
- user_id: integer (Users)
- token: string
- expires_at: timestamp
- created_at: timestamp

## システム設定 (Settings)
- key: string
- value: json
- updated_at: timestamp
- updated_by: integer (Users)

## 練習セット (PracticeSets)
- id: integer
- name: string
- description: text
- created_by: integer (Users)
- created_at: timestamp
- updated_at: timestamp

## 練習アサイン (PracticeAssignments)
- id: integer
- practice_set_id: integer (PracticeSets)
- user_id: integer (Users)
- assigned_at: timestamp
- due_date: timestamp

## メール通知設定 (NotificationSettings)
- id: integer
- user_id: integer (Users)
- email_enabled: boolean
- notification_types: json
- created_at: timestamp
- updated_at: timestamp
