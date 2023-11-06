const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      answer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
      },
      nextStep: {
        ref: "SingleQestion",
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

questionSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const SingleQestion = mongoose.model("SingleQestion", questionSchema);

module.exports = SingleQestion;
