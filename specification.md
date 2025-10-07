# JLPT Practice Web Application — Specification

## 1. Overview
This project is a **JLPT mock test and sprint practice web application** designed for Japanese language learners.
Initially, it will be used in the developer’s own classes, but it is intended to be extended later into a public web service and possibly a mobile app (iOS/Android).

The app will provide both **mock test mode** and **sprint (drill) mode**, allowing learners to practise reading, vocabulary, and grammar questions interactively.

---

## 2. User Roles

| Role        | Description                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| **Learner** | Can take mock tests or sprint practices. Holds a list of studied learning items (characters, vocabulary, grammar). |
| **Teacher** | Can view learner progress and results. (Later feature; not required in MVP.)                                       |
| **Admin**   | Manages questions, learning items, and system data. (Only admins can add or edit questions.)                       |

---

## 3. MVP Scope

For the first version (MVP):

- Only **learners** and **admins** are needed.
- **Teachers** and **class-based grouping** will be implemented later.
- Learners can:
  - Select JLPT level (N5–N1)
  - Take mock tests or sprints
  - Have questions filtered by their studied items + selected level
- Admin can:
  - Manage learning items and questions
  - Import data from CSV/TSV files

---

## 4. Core Features

### 4.1 Learner Features
- User registration & login (JWT authentication)
- Manage “studied learning items”
- Choose test mode:
  - **Mock Test Mode:** full test simulation (timed, fixed number of questions)
  - **Sprint Mode:** quick, unlimited drills based on selected topics
- Receive randomized multiple-choice questions (4 options per question)
- See results and review answers

### 4.2 Admin Features
- CRUD operations for:
  - Characters
  - Vocabulary
  - Grammar items
  - Questions
  - Question options
- Import official data files (CSV/TSV) into database

---

## 5. Question Structure

JLPT questions are **4-choice multiple-choice** format.
Each question consists of one correct answer and three distractors.

### Design options discussed:
1. Separate columns:
   `correct_option`, `incorrect_option1`, `incorrect_option2`, `incorrect_option3`
2. Normalised design (recommended):
   - `questions` table stores question text only
   - `question_options` table stores 4 options + marks which one is correct

Chosen design: **Option 2** (normalised), for flexibility and future metadata support.

---

## 6. Distractor Metadata (Future Feature)

Each incorrect option may include metadata describing how it was created, e.g.:

| Tag                 | Example           | Description             |
| ------------------- | ----------------- | ----------------------- |
| `shared_component`  | 「時」→「待」     | Shares a kanji element  |
| `shared_reading`    | 「時」→「事」     | Same or similar reading |
| `similar_meaning`   | 「時」→「期」     | Semantically related    |
| `context_confusion` | 「聞く」→「聴く」 | Easily confused usage   |

These metadata will allow analysis of learner error patterns and more sophisticated question generation later.

---

## 7. Learning Item Design

Learning items are divided into three types with different attributes:
- **Characters**
- **Vocabulary**
- **Grammar Items**

Each has distinct columns (e.g. reading, meaning, JLPT level, word type, etc.).
Therefore, each will be its own table.

### Relationships
Learners have many learning items, and each question may relate to multiple learning items.
To represent this:

#### Learner progress:
```sql
learners_learning_items
- learner_id
- learning_item_type  ('character' | 'vocabulary' | 'grammar')
- learning_item_id
- studied_at
```

#### Question mapping:
```sql
questions_learning_items
- question_id
- learning_item_type
- learning_item_id
```

This design allows flexible linking between different item types and questions.

---

## 8. Database Schema (Outline)
```sql
users
- id
- role ('learner' | 'teacher' | 'admin')
- name
- email
- password_hash
- created_at

characters
- id
- literal
- reading
- jlpt_level
- meaning
- components
- notes

vocabularies
- id
- word
- reading
- jlpt_level
- meaning
- part_of_speech
- notes

grammar_items
- id
- expression
- jlpt_level
- meaning
- usage
- notes

questions
- id
- text
- jlpt_level
- question_type ('character' | 'vocabulary' | 'grammar')
- created_at

question_options
- id
- question_id
- text
- is_correct
- distractor_tag (optional)
- notes (optional)

questions_learning_items
- question_id
- learning_item_type
- learning_item_id

learners_learning_items
- learner_id
- learning_item_type
- learning_item_id
- studied_at

results
- id
- learner_id
- question_id
- selected_option_id
- is_correct
- answered_at
```

---

## 9. Directory Structure
```
project/
├─ src/
│  ├─ server/             # Bun server (routes, middleware, handlers)
│  ├─ client/             # Hono JSX or React frontend
│  ├─ db/
│  │  ├─ schema.sql
│  │  └─ importUtils.ts
│  └─ types.ts
├─ data/
│  ├─ app.db              # SQLite database
│  ├─ characters.tsv
│  ├─ vocabularies.tsv
│  ├─ grammar_items.tsv
│  ├─ questions.tsv
│  └─ question_options.tsv
├─ scripts/
│  ├─ seed.ts             # Development seed data (for testing)
│  └─ import.ts           # Production data import from CSV/TSV
├─ package.json
└─ tsconfig.json
```

---

## 10. Database Storage Policy

- SQLite database file (app.db) is stored in `/data/`
- This directory also contains the CSV/TSV data files used for import
- `scripts/seed.ts` resets and populates test data
- `scripts/import.ts` imports production data from `data/*.csv` or `data/*.tsv`

---

## 11. Tech Stack

| Layer                  | Technology                     |
| ---------------------- | ------------------------------ |
| **Runtime**            | Bun                            |
| **Backend Framework**  | Bun                            |
| **Frontend Rendering** | Hono JSX (`hono/jsx/dom`)      |
| **Database**           | SQLite                         |
| **Auth**               | JWT (Hono built-in)            |
| **Language**           | TypeScript                     |
| **Styling (optional)** | TBD                            |
| **Testing**            | bun test                       |

---

## 12. Future Features (Post-MVP)

- Teacher role and class-based grouping
- Detailed analytics per learner
- Distractor tagging and error pattern analysis
- Mobile app release (React Native / Capacitor)
- Adaptive question selection based on performance
- User interface for question and item management

---

## 13. References for Data Sources

- 日本語を読むための語彙データベース Ver. 1.11
- 現代日本語文字データベース (CDJ) Version. 2.1
- はごろも（文法項目整理参考）

