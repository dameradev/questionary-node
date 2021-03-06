const Question = require("../models/question");
const Answer = require("../models/answer");
const { Category } = require("../models/category");

exports.getIndex = async (req, res, next) => {
  const questions = await Question.find().populate("user", "email");
  const categories = await Category.find();

  res.render("questions/question-list", {
    pageTitle: "Questionary",
    path: "/questions",
    questions,
    categories
  });
};

exports.getQuestion = async (req, res, next) => {
  const question = await Question.findById(req.params.id).populate("user");
  const answers = await Answer.find({ questionId: question._id });

  res.render("questions/question-details", {
    pageTitle: "Details about a question",
    path: "/question",
    question,
    answers
  });
};

exports.getAddQuestion = (req, res, next) => {
  Category.find()
    .then(categories => {
      res.render("questions/add-question", {
        pageTitle: "Ask away!",
        path: "/questions",
        categories
      });
    })
    .catch(err => console.log(err));
};

exports.postAddQuestion = async (req, res, next) => {
  const user = req.user;
  const title = req.body.title;
  const content = req.body.content;
  const categoryId = req.body.category;

  const category = await Category.findById(categoryId);

  Question.create({
    title,
    content,
    user,
    category: {
      _id: category._id,
      title: category.title
    }
  }).then(() => {
    res.redirect("/questions");
  });
};

exports.postDeleteQuestion = (req, res, next) => {
  const questionId = req.params.questionId;

  Question.findOneAndDelete(questionId).then((question)=> {
    console.log('Deleted question', question);
    res.redirect('/')
  }).catch(err => console.log(err));
}


exports.postAddAnswer = (req, res, next) => {
  const user = req.user;
  const content = req.body.content;
  const questionId = req.body.questionId;

  Answer.create({
    content,
    userId: user,
    questionId
  }).then(() => {
    console.log("Answer added!");
    res.redirect(`/questions/${questionId}`);
  });
};

exports.postAddVote = async (req, res, next) => {
  const answerId = req.body.answerId;
  const user = req.user;
  const questionId = req.body.questionId;
  const answer = await Answer.findById(answerId);

  answer
    .addVote(user._id)
    .then(() => {
      console.log("Vote added");
      res.redirect(`/questions/${questionId}`);
    })
    .catch(err => console.log(err));
};


