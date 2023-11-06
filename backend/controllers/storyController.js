const storyModel = require("../models/storyModel");
const finalStory = require("../models/finalStepModel");

exports.createStory = async (req, res) => {
  try {
    const story = new storyModel(req.body);
    const savedStory = await story.save();

    res.status(201).send(savedStory);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.createFinalStory = async (req, res) => {
  try {
    const story = new finalStory(req.body);
    await story.save();
    res.status(201).send(story);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getStory = async (req, res) => {
  const { id } = req.params;
  try {
    let story = await storyModel.findOne({ _id: id });
    res.status(200).json({ story });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getFinalStory = async (req, res) => {
  const { id } = req.params;
  try {
    let story = await finalStory.findOne({ id });
    res.status(200).json({ story });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getFirstStory = async (res) => {
  try {
    let story = await storyModel.findOne({ _id: process.env.FIRST_STORY });
    res.status(200).json({ story });
  } catch (error) {
    res.status(400).send(error);
  }
};
