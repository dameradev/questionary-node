const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Answer", answerSchema);
