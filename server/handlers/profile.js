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
    const profile = await db
      .collection("users")
      .findOne({ _id: req.user.user._id });
    console.log(profile);

    res.send({
      _id: profile._id,
      username: profile.username,
      email: profile.email,
      pets: profile.pets,
      friends: profile.friends,
      album: profile.album,
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
