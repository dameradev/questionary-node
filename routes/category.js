const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");

router.get('/categories/:id', categoryController.getCategory);

module.exports = router;
