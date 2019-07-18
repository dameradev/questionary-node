const Question = require("../models/question");
const Answer = require("../models/answer");



exports.getIndex = async (req, res, next) => {
  const questions = await Question.find().populate('user', 'name');
  
  res.render("questions/question-list", {
    pageTitle: "Questionary",
    path: "/questions",
    questions
  });
};

exports.getQuestions = async (req, res, next) => {
  const questions = await Question.find().populate('user');
  res.render("questions/question-list", {
    pageTitle: "Questionary",
    path: "/questions",
    questions
  });
};

exports.getQuestion = async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  const answers = await Answer.find({questionId: question._id})
  
  res.render('questions/question-details', {
    pageTitle: 'Details about a question',
    path: '/question',
    question,
    answers
  })
}

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
  const content = req.body.content;
  const questionId = req.body.questionId;

  Answer.create({ 
    content,
    userId:user,
    questionId
  }).then(()=>{
    console.log('Answer added!');
    res.redirect(`/questions/${questionId}`);
  })
}

exports.postAddVote = async(req, res, next) => {
  const answerId = req.body.answerId;
  const user = req.user;
  const questionId = req.body.questionId;
  const answer = await Answer.findById(answerId);
  
    answer.addVote(user._id)
    .then(()=> {
    console.log('Vote added');
    res.redirect(`/questions/${questionId}`);
  }).catch(err=>console.log(err));
}