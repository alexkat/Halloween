const axios = require("axios");

async function fetchStory(id) {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/story/getstory/${id}`
  );
  return response.data;
}

async function fetchFirstQuestion() {
  const response = await axios.get(`${process.env.BACKEND_URL}/story/getfirst`);
  return response.data;
}
async function finalStep(id) {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/story/getfinal/${id}`
  );
  return response.data;
}

module.exports = {
  fetchStory,
  fetchFirstQuestion,
  finalStep,
};
