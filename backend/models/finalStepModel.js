const mongoose = require("mongoose");

const finalStorySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});

finalStorySchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const finalStory = mongoose.model("finalStory", finalStorySchema);

module.exports = finalStory;
