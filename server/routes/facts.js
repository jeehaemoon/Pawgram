const router = require("express").Router();
const request = require("request-promise");

require("dotenv").config();

const optionsDogFact = {
  uri: "https://dog-api.kinduff.com/api/facts",
  method: "GET",
  json: true,
};

const optionsCatFact = {
  uri: "https://catfact.ninja/fact",
  method: "GET",
  json: true,
};

const getDogFact = async (req, res) => {
  try {
    const data = await request(optionsDogFact);

    if (data !== undefined) {
      res
        .status(200)
        .json({ status: 200, data: data.facts, message: "Fact retrieved" });
    } else {
      res.status(400).json({ status: 400, message: "No fact available" });
    }
  } catch (err) {
    console.log(err);
    // on failure, send
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const getCatFact = async (req, res) => {
  try {
    const data = await request(optionsCatFact);

    if (data !== undefined) {
      res
        .status(200)
        .json({ status: 200, data: data.fact, mesasge: "Fact retrieved" });
    } else {
      res.status(400).json({ status: 400, message: "No fact available." });
    }
  } catch (err) {
    console.log(err);
    // on failure, send
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

router.get("/dog", getDogFact);
router.get("/cat", getCatFact);

module.exports = router;
