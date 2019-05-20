module.exports.getIndex = (req, res, next) => {
  res.render('questions/question-list', {
    pageTitle: 'Questionary',
    path: '/questions'
  });
}

module.exports.getQuestions = (req, res, next) => {
  res.render('questions/question-list', {
    pageTitle: 'Questionary',
    path: '/questions'
  });
};

module.exports.getAddQuestion = (req, res, next) => {
  res.render("questions/add-question", {
    pageTitle: "Ask away!",
    path: "/questions"
  });
};


module.exports.postAddQuestion = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
}