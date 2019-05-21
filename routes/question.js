const express = require("express");

const router = express.Router();

const questionController = require("../controllers/question");

router.get("/", questionController.getQuestions);

router.get('/:id', questionController.getQuestion);

router.get("/add-question", questionController.getAddQuestion);

router.post("/add-question", questionController.postAddQuestion);

router.post('/answer', questionController.postAddAnswer);

router.post('/add-vote', questionController.postAddVote);

module.exports = router;
