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

const getFriends = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    const user = await db
      .collection("users")
      .findOne({ _id: req.user.user._id });

    if (user.friends.length !== 0) {
      res.status(200).json({
        status: 200,
        data: user.friends,
        message: "Friends retrieved",
      });
    } else {
      res.status(400).json({ status: 400, message: "no friends" });
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const addFriend = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id, username } = req.body;

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    const friend = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: req.user.user._id },
        { $push: { friends: { _id: _id, username: username } } }
      );

    // add myself in the friends list of my friend
    await db.collection("users").findOneAndUpdate(
      { _id: _id },
      {
        $push: {
          friends: {
            _id: req.user.user._id,
            username: req.user.user.username,
          },
        },
      }
    );
    if (friend !== undefined) {
      res.status(200).json({
        status: 200,
        data: friend,
        message: "Friend added",
      });
    } else {
      res.status(400).json({ status: 400, message: "user not found" });
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};
const deleteFriend = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id } = req.body;
  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");
    console.log(req.user.user._id);

    await db
      .collection("users")
      .updateOne(
        { _id: req.user.user._id },
        { $pull: { friends: { _id: _id } } }
      );

    await db
      .collection("users")
      .updateOne(
        { _id: _id },
        { $pull: { friends: { _id: req.user.user._id } } }
      );

    res.status(200).json({
      status: 200,
      message: "friend deleted",
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

module.exports = {
  getFriends,
  addFriend,
  deleteFriend,
};
