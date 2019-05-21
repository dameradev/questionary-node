const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voteSchema = new Schema({
  vote: {
    type: Number,
    required: true
  },
  answerId: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
  
});

module.exports = mongoose.model("Vote", voteSchema);
