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

const postPicture = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const _id = uuidv4();
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  const { note } = req.body;
  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    console.log(req.file);
    await db
      .collection("users")
      .findOneAndUpdate(
        { _id: req.user.user._id },
        { $push: { album: { _id: _id, src: req.file.path } } }
      );

    const picture = await db.collection("pictures").insertOne({
      _id: _id,
      date: date,
      time: time,
      src: "/uploads/" + req.file.filename,
      note: note,
      owner: req.user.user._id,
      comments: [],
      likes: [],
    });

    assert.equal(true, picture.acknowledged);

    res.status(200).json({ status: 200, message: "picture added" });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

const getPictures = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    // const picture = await db.collection("pictures").find().toArray();

    // const pictureByUser = picture.filter(
    //   (item) => item.owner === req.user.user._id
    // );

    const user = await db
      .collection("users")
      .findOne({ _id: req.user.user._id });

    res.status(200).json({
      status: 200,
      data: user,
      message: "pictures retrieved",
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

const getPicture = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id } = req.params;
  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    const picture = await db.collection("pictures").findOne({ _id: _id });

    if (picture !== undefined) {
      res.status(200).json({
        status: 200,
        data: picture,
        message: "pictures retrieved",
      });
    } else {
      res.status(400).json({ status: 400, message: "no picture" });
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

const deletePost = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id } = req.params;
  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    await db
      .collection("users")
      .updateOne(
        { _id: req.user.user._id },
        { $pull: { album: { _id: _id } } }
      );

    const picture = await db.collection("pictures").deleteOne({ _id: _id });

    res.status(200).json({
      status: 200,
      data: picture,
      message: "deleted",
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const postComment = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const commentId = uuidv4();
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  const { comment } = req.body;
  const { _id } = req.params;

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    await db.collection("pictures").findOneAndUpdate(
      { _id: _id },
      {
        $push: {
          comments: {
            _id: commentId,
            date: date,
            time: time,
            comment: comment,
            author: req.user.user._id,
            username: req.user.user.username,
          },
        },
      }
    );

    res.status(200).json({ status: 200, message: "comment added" });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

const deleteComment = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const commentId = req.body._id;
  const { _id } = req.params;

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    await db
      .collection("pictures")
      .updateOne({ _id: _id }, { $pull: { comments: { _id: commentId } } });

    res.status(200).json({
      status: 200,
      message: "comment deleted",
    });
  } catch (err) {
    console.log(err);
    // on failure, send
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const postLike = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const likeId = uuidv4();
  const { _id } = req.params;

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    // find if liked
    const like = await db
      .collection("pictures")
      .find({ $and: [{ _id: _id }, { "likes.author": req.user.user._id }] })
      .toArray();

    if (like.length === 0) {
      await db.collection("pictures").findOneAndUpdate(
        { _id: _id },
        {
          $push: {
            likes: {
              _id: likeId,
              author: req.user.user._id,
              username: req.user.user.username,
            },
          },
        }
      );

      res.status(200).json({ status: 200, message: "liked" });
    } else {
      await db
        .collection("pictures")
        .updateOne(
          { _id: _id },
          { $pull: { likes: { author: req.user.user._id } } }
        );

      res.status(200).json({ status: 200, message: "unliked" });
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

module.exports = {
  postPicture,
  getPictures,
  getPicture,
  deletePost,
  postComment,
  deleteComment,
  postLike,
};
