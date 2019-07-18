const Question = require("../models/question");
const { Category } = require("../models/category");

exports.getCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const questions = await Question.find({
    "category._id": categoryId
  }).populate("user", "email");
  const categories = await Category.find();

  res.render("questions/question-list", {
    pageTitle: "Questionary",
    path: "/questions",
    questions,
    categories
  });
};

exports.getAddCategory = (req, res, next) => {
  res.render("categories/add-category", {
    pageTitle: "Add category",
    path: "/categories"
  });
};

exports.postAddCategory = (req, res, next) => {
  const title = req.body.title;
  const category = new Category({
    title
  });

  category
    .save()
    .then(result => {
      res.redirect("/");
    })
    .catch(err => console.log(err));
};
