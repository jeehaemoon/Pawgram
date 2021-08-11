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

const sendMessage = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id } = req.params;
  const dateSent = new Date().toLocaleDateString();
  const timeSent = new Date().toLocaleTimeString();
  const { time, date } = req.body;
  const messageId = uuidv4();

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    const user = await db.collection("users").findOneAndUpdate(
      { _id: _id },
      {
        $push: {
          messages: {
            _id: messageId,
            author: req.user.user._id,
            username: req.user.user.username,
            date: date,
            time: time,
            timeSent: timeSent,
            dateSent: dateSent,
          },
        },
      }
    );

    if (user !== undefined) {
      res.status(200).json({
        status: 200,
        message: "Message sent",
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

const replyMessage = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const dateSent = new Date().toLocaleDateString();
  const timeSent = new Date().toLocaleTimeString();
  const { _id, friendId, friendUsername, date, time, accepted } = req.body;

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    if (accepted === true) {
      await db.collection("users").findOneAndUpdate(
        { _id: friendId },
        {
          $push: {
            playdate: {
              _id: _id,
              friend: req.user.user.username,
              dateSent: dateSent,
              timeSent: timeSent,
              date: date,
              time: time,
            },
          },
        }
      );

      await db
        .collection("users")
        .updateOne({ _id: friendId }, { $pull: { messages: { _id: _id } } });
      await db.collection("users").findOneAndUpdate(
        { _id: req.user.user._id },
        {
          $push: {
            playdate: {
              _id: _id,
              friend: friendUsername,
              dateSent: dateSent,
              timeSent: timeSent,
              date: date,
              time: time,
            },
          },
        }
      );

      await db
        .collection("users")
        .updateOne(
          { _id: req.user.user._id },
          { $pull: { messages: { _id: _id } } }
        );

      res.status(200).json({
        status: 200,
        message: "Play Date accepted",
      });
    } else {
      await db.collection("users").findOneAndUpdate(
        { _id: friendId },
        {
          $push: {
            messages: {
              _id: _id,
              friend: req.user.user.username,
              dateSent: dateSent,
              timeSent: timeSent,
              date: date,
              time: time,
              accepted: false,
            },
          },
        }
      );

      await db
        .collection("users")
        .updateOne(
          { _id: req.user.user._id, "messages._id": _id },
          { $set: { "messages.$.accepted": false } }
        );

      res.status(200).json({
        status: 200,
        message: "Play Date refused.",
      });
    }
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
  sendMessage,
  replyMessage,
};
