// ----------------------
// 単語データ
// ----------------------
const words = [
  { en: "ability", jp: "能力" },
  { en: "accept", jp: "受け入れる" },
  { en: "account", jp: "口座 / 説明" },
  { en: "achieve", jp: "達成する" },
  { en: "advance", jp: "前進する" },
  { en: "advantage", jp: "利点" },
  { en: "affect", jp: "影響する" },
  { en: "agency", jp: "代理店" },
  { en: "agree", jp: "同意する" },
  { en: "allow", jp: "許す" },
  // 必要ならここに追加していける
];

// ----------------------
let quizList = [];
let currentIndex = 0;
let correctCount = 0;
let timer;
let timeLeft = 0;

// ----------------------
// スタート
// ----------------------
function startQuiz() {
  const mode = document.getElementById("mode").value;
  const count = Number(document.getElementById("questionCount").value);
  const limit = Number(document.getElementById("timeLimit").value);

  timeLeft = limit;

  quizList = shuffle(words).slice(0, count);
  currentIndex = 0;
  correctCount = 0;

  document.getElementById("settingsArea").style.display = "none";
  document.getElementById("quizArea").style.display = "block";
  document.getElementById("progressArea").style.display = "block";

  document.getElementById("totalNum").textContent = count;

  showQuestion(mode);
  startTimer();
}

// ----------------------
// タイマー
// ----------------------
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `残り時間: ${timeLeft}秒`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion(false);
    }
  }, 1000);
}

// ----------------------
// 問題表示
// ----------------------
function showQuestion(mode) {
  const q = quizList[currentIndex];

  document.getElementById("nowNum").textContent = currentIndex + 1;

  const questionText = mode === "en_to_jp" ? q.en : q.jp;
  const correctAnswer = mode === "en_to_jp" ? q.jp : q.en;

  document.getElementById("question").textContent = questionText;

  let choices = [correctAnswer];
  while (choices.length < 4) {
    const rand = words[Math.floor(Math.random() * words.length)];
    const option = mode === "en_to_jp" ? rand.jp : rand.en;
    if (!choices.includes(option)) choices.push(option);
  }

  choices = shuffle(choices);

  const choicesArea = document.getElementById("choices");
  choicesArea.innerHTML = "";

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.onclick = () => nextQuestion(choice === correctAnswer);
    choicesArea.appendChild(btn);
  });
}

// ----------------------
// 次の問題
// ----------------------
function nextQuestion(isCorrect) {
  clearInterval(timer);

  const judge = document.getElementById("judge");

  if (isCorrect) {
    correctCount++;
    judge.textContent = "〇";
    judge.className = "correct show";
  } else {
    judge.textContent = "×";
    judge.className = "wrong show";
  }

  // ★ 次へボタンを表示
  document.getElementById("nextBtn").style.display = "block";
}

/* ★★★ ここに追加する ★★★ */
function goNext() {
  document.getElementById("nextBtn").style.display = "none";

  // judge を消す
  const judge = document.getElementById("judge");
  judge.textContent = "";
  judge.className = "";

  currentIndex++;

  if (currentIndex >= quizList.length) {
    showResult();
  } else {
    timeLeft = Number(document.getElementById("timeLimit").value);
    showQuestion(document.getElementById("mode").value);
    startTimer();
  }
}
/* ★★★ ここまで ★★★ */

// ----------------------
// 結果表示
// ----------------------
function showResult() {
  document.getElementById("quizArea").style.display = "none";
  document.getElementById("progressArea").style.display = "none";

  const resultArea = document.getElementById("resultArea");
  resultArea.style.display = "block";

  const rate = Math.round((correctCount / quizList.length) * 100);

  resultArea.innerHTML = `
    <h2>結果</h2>
    <p>正解数：${correctCount} / ${quizList.length}</p>
    <p>正答率：${rate}%</p>
    <button class="result-btn" onclick="returnToStart()">スタート画面に戻る</button>
  `;
}

// ----------------------
// スタート画面へ戻る
// ----------------------
function returnToStart() {
  document.getElementById("resultArea").style.display = "none";
  document.getElementById("settingsArea").style.display = "block";
}

// ----------------------
// シャッフル
// ----------------------
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
