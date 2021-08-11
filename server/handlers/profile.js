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

    res.send({
      _id: profile._id,
      username: profile.username,
      email: profile.email,
      pets: profile.pets,
      friends: profile.friends,
      album: profile.album,
      messages: profile.messages,
      playdate: profile.playdate,
    });
  } catch (err) {
    console.log(err);
    // on failure, send
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const getUsers = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    // find user with the same email and username
    const users = await db
      .collection("users")
      .find({ _id: { $nin: [req.user.user._id] } })
      .toArray();

    for (let i = 0; i < users.length; i++) {
      delete users[i]["password"];
    }

    if (users.length !== 0) {
      res.status(200).json({
        status: 200,
        data: users,
        message: "users retrieved",
      });
    } else {
      res
        .status(400)
        .json({ status: 400, message: "there are no other users" });
    }
  } catch (err) {
    console.log(err);
    // on failure, send
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const getUser = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id } = req.params;

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    const user = await db.collection("users").findOne({ _id: _id });

    if (user !== undefined) {
      res.status(200).json({
        status: 200,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          pets: user.pets,
          friends: user.friends,
          album: user.album,
        },
        message: "user retrieved",
      });
    } else {
      res.status(400).json({ status: 400, message: "user not found" });
    }
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
  getUsers,
  getUser,
};
