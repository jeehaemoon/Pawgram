"use strict";

const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");
const request = require("request-promise");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getProfile = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    // find user with the same email and username
    await db.collection("users").findOne({ _id: req.user });

    res.send({
      _id: req.user.user._id,
      username: req.user.user.username,
      email: req.user.user.email,
      pets: req.user.user.pets,
      friends: req.user.user.friends,
      album: req.user.user.album,
    });
  } catch (err) {
    console.log(err);
    // on failure, send
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

module.exports = {
  getProfile,
};
