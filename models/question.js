const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const {categorySchema} = require('./category');


const questionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: categorySchema,
    required:true
  }
});

module.exports = mongoose.model("Question", questionSchema);
