const Question = require("../models/question");

exports.getIndex = async (req, res, next) => {
  const questions = await Question.find().populate('user', 'name');
  console.log(questions);
  res.render("questions/question-list", {
    pageTitle: "Questionary",
    path: "/questions",
    questions
  });
};

exports.getQuestions = async (req, res, next) => {
  const questions = await Question.find();
  res.render("questions/question-list", {
    pageTitle: "Questionary",
    path: "/questions",
    questions
  });
};

exports.getAddQuestion = (req, res, next) => {
  console.log(req);
  res.render("questions/add-question", {
    pageTitle: "Ask away!",
    path: "/questions"
  });
};

exports.postAddQuestion = async(req, res, next) => {
  const user = req.user;
  const title = req.body.title;
  const content = req.body.content;
  
  Question.create({
    title,
    content,
    user
  }).then(() => {
    console.log("Question added!");
    res.redirect("/questions");
  });
};

exports.postAddAnswer = (req, res, next) => {
  const user = req.user;
  const title = req.body.title;
  const content = req.body.content;
  const questionId = req.body.questionId;

}