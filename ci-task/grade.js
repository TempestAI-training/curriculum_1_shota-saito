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

module.exports = { assignGrades };