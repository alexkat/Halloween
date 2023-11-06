const express = require("express");
const storyController = require("../controllers/storyController");

const router = express.Router();

// Get the user ID for the authenticated user
router.post("/create", storyController.createStory);

router.post("/createfinal", storyController.createFinalStory);

router.get("/getstory/:id", storyController.getStory);

router.get("/getfinal/:id", storyController.getFinalStory);

router.get("/getfirst", storyController.getFirstStory);

module.exports = router;
