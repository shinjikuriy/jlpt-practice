// Simple CLI quiz application for JLPT practice

type QuestionOption = {
  text: string
  isCorrect: boolean
}

type Question = {
  text: string
  options: QuestionOption[]
}

// Parse CSV file and return array of questions
async function loadQuestionsFromCSV(filePath: string): Promise<Question[]> {
  const file = Bun.file(filePath)
  const content = await file.text()
  const lines = content.trim().split('\n')

  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row')
  }

  // Skip header row
  const dataRows = lines.slice(1)
  const questions: Question[] = []

  for (const row of dataRows) {
    // Simple CSV parsing (handles basic cases, may need enhancement for quoted fields)
    const columns = row.split(',').map((col) => col.trim())

    if (columns.length < 6) {
      console.warn(`Skipping invalid row: ${row}`)
      continue
    }

    const [questionText, option1, option2, option3, option4, correctIndexStr] =
      columns
    const correctIndex = parseInt(correctIndexStr, 10)

    if (isNaN(correctIndex) || correctIndex < 1 || correctIndex > 4) {
      console.warn(`Invalid correct_index in row: ${row}`)
      continue
    }

    const options: QuestionOption[] = [
      { text: option1, isCorrect: correctIndex === 1 },
      { text: option2, isCorrect: correctIndex === 2 },
      { text: option3, isCorrect: correctIndex === 3 },
      { text: option4, isCorrect: correctIndex === 4 },
    ]

    questions.push({
      text: questionText,
      options,
    })
  }

  return questions
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

async function askQuestion(question: Question): Promise<boolean> {
  console.log('\n' + question.text)
  console.log('─'.repeat(40))

  // Shuffle options
  const shuffledOptions = shuffleArray(question.options)
  const correctAnswerIndex = shuffledOptions.findIndex((opt) => opt.isCorrect)

  // Display shuffled options
  shuffledOptions.forEach((option, index) => {
    console.log(`${index + 1}. ${option.text}`)
  })

  // Get user input
  console.log('\n答えを選んでください (1-4): ')

  // Read from stdin
  for await (const line of console) {
    const input = line.trim()
    const answerNum = parseInt(input, 10)

    // Validate input
    if (isNaN(answerNum) || answerNum < 1 || answerNum > 4) {
      console.log('1から4の数字を入力してください: ')
      continue
    }

    // Check answer (using 0-based index)
    const selectedIndex = answerNum - 1
    const isCorrect = selectedIndex === correctAnswerIndex

    console.log('\n' + '='.repeat(40))
    if (isCorrect) {
      console.log('✓ 正解です！')
    } else {
      const correctAnswerNum = correctAnswerIndex + 1
      console.log('✗ 不正解です')
      console.log(
        `正解は ${correctAnswerNum}. ${shuffledOptions[correctAnswerIndex].text} でした`
      )
    }
    console.log('='.repeat(40))

    return isCorrect
  }

  return false
}

async function main() {
  console.log('\n🎌 JLPT練習アプリ 🎌')
  console.log('='.repeat(40))

  // Load questions from CSV
  const csvPath = 'data/questions.csv'
  let questions: Question[]

  try {
    questions = await loadQuestionsFromCSV(csvPath)
    console.log(`\n${questions.length}件の問題を読み込みました。`)
  } catch (error) {
    console.error(`エラー: CSVファイルの読み込みに失敗しました: ${error}`)
    process.exit(1)
  }

  if (questions.length === 0) {
    console.error('エラー: 問題が見つかりませんでした。')
    process.exit(1)
  }

  // For now, ask the first question
  const result = await askQuestion(questions[0])

  console.log('\n終了します。')
  process.exit(0)
}

main()
