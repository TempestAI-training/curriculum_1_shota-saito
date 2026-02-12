const assignGrades = (scores) => {
  return scores.map((score) => {
    if (score >= 80) {
      return "A";
    } else if (score >= 60) {
      return "B";
    } else if (score >= 40) {
      return "C";
    } else if (score >= 20) {
      return "D";
    } else {
      return "E";
    }
  });
};

const N = Number(window.prompt("生徒の数を入力してください (例: 3)"));

const testScores = [];

for (let i = 0; i < N; i++) {
  const input = window.prompt((i + 1) + "人目の点数を入力してください");
  testScores.push(Number(input));
}

console.log("入力された点数:", testScores);

console.log("成績:", assignGrades(testScores));