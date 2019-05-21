const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  
  votes: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    count: {
      type: Number,
      required: true,
      default: 0
    },
    
  }
});

answerSchema.methods.addVote = function(userId) {
  let newCount = 1;
  let updatedVotes = this.votes.count;
  
  
  if (!this.votes.userId){
    this.votes.userId = userId;  
    updatedVotes = newCount;
    console.log('here')
  } else if (this.votes.userId.toString() !== userId.toString())  {
    console.log('here')
    updatedVotes = updatedVotes + newCount;
  }
  console.log(this.votes.userId);
  console.log(userId);
  this.votes.count = updatedVotes;
  return this.save();
}

module.exports = mongoose.model("Answer", answerSchema);
