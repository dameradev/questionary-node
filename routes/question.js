const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/is-auth");

const questionController = require("../controllers/question");

router.get("/", questionController.getQuestions);

router.get("/add-question", isAuth, questionController.getAddQuestion);

router.post("/add-question", isAuth, questionController.postAddQuestion);

router.post("/answer", isAuth, questionController.postAddAnswer);

router.post("/add-vote", isAuth, questionController.postAddVote);

router.get("/:id", questionController.getQuestion);
module.exports = router;
