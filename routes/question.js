const express = require('express');

const router = express.Router();

const questionController = require('../controllers/question');

router.get('/', questionController.getQuestions);


module.exports = router;