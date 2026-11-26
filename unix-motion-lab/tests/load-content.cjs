const extra = require('../assets/lessons-more.js');
module.exports = {
  lessons: [...require('../assets/lessons.js'), ...extra.lessons],
  quizzes: [...require('../assets/quizzes.js'), ...extra.quizzes]
};
