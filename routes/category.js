const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");

router.get("/categories/:id", categoryController.getCategory);

router.get("/add-category", categoryController.getAddCategory);
router.post("/add-category", categoryController.postAddCategory);

module.exports = router;
