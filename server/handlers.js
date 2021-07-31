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

const optionsApiDogBreed = {
  uri: "https://api.thedogapi.com/v1/breeds",
  headers: {
    Accept: process.env.api_key_dog,
  },
  method: "GET",
  json: true,
};

const optionsApiCatBreed = {
  uri: "https://api.thecatapi.com/v1/breeds",
  headers: {
    Accept: process.env.api_key_cat,
  },
  method: "GET",
  json: true,
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
    });
  } catch (err) {
    console.log(err);
    // on failure, send
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const getDogBreeds = async (req, res) => {
  const breedArr = [];
  try {
    const data = await request(optionsApiDogBreed);

    data.forEach((breed) => {
      breedArr.push(breed.name);
    });

    if (breedArr.length !== 0) {
      res.status(200).json({
        status: 200,
        data: breedArr,
        message: "Breeds retrieved",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No data found.",
      });
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const getCatBreeds = async (req, res) => {
  const breedArr = [];
  try {
    const data = await request(optionsApiCatBreed);

    data.forEach((breed) => {
      breedArr.push(breed.name);
    });

    if (breedArr.length !== 0) {
      res.status(200).json({
        status: 200,
        data: breedArr,
        message: "Breeds retrieved",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No data found.",
      });
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const postPet = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  const { _id, type, breed, name, gender, age } = req.body;
  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    await db
      .collection("users")
      .findOneAndUpdate(
        { _id: req.user.user._id },
        { $push: { pets: { _id: _id, name: name } } }
      );

    if (type === "dog") {
      const data = await request(optionsApiDogBreed);

      const info = data.filter((dog) => dog.name === breed);

      const pet = await db
        .collection("pets")
        .insertOne({ _id, type, gender, age, name, info });

      res.status(200).json({
        status: 200,
        data: pet,
        message: "Dog added",
      });
    } else if (type === "cat") {
      const data = await request(optionsApiCatBreed);

      const info = data.filter((cat) => cat.name === breed);

      const pet = await db
        .collection("pets")
        .insertOne({ _id, type, gender, age, name, info });

      res.status(200).json({
        status: 200,
        data: pet,
        message: "Cat added",
      });
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const getPetInfo = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id } = req.params;

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    const pet = await db.collection("pets").findOne({ _id: _id });

    if (pet !== undefined) {
      res.status(200).json({
        status: 200,
        data: pet,
        message: "Info Retrieved.",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Not available",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const editPetInfo = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id, type, breed, name, gender, age } = req.body;
  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    await db
      .collection("users")
      .updateOne(
        { _id: req.user.user._id, "pets._id": _id },
        { $set: { "pets.$.name": name } }
      );

    if (type === "dog") {
      const data = await request(optionsApiDogBreed);

      const info = data.filter((dog) => dog.name === breed);

      const pet = await db.collection("pets").updateOne(
        { _id: _id },
        {
          $set: {
            name: name,
            type: type,
            gender: gender,
            age: age,
            info: info,
          },
        }
      );

      res.status(200).json({
        status: 200,
        data: pet,
        message: "Dog added",
      });
    } else if (type === "cat") {
      const data = await request(optionsApiCatBreed);

      const info = data.filter((cat) => cat.name === breed);

      const pet = await db.collection("pets").updateOne(
        { _id: _id },
        {
          $set: {
            name: name,
            type: type,
            gender: gender,
            age: age,
            info: info,
          },
        }
      );

      res.status(200).json({
        status: 200,
        data: pet,
        message: "Cat added",
      });
    }
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const deletePet = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id } = req.body;
  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");
    console.log(req.user.user._id);

    await db
      .collection("users")
      .updateOne({ _id: req.user.user._id }, { $pull: { pets: { _id: _id } } });

    const pet = await db.collection("pets").deleteOne({ _id: _id });

    res.status(200).json({
      status: 200,
      data: pet,
      message: "deleted",
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
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

const addFriend = async (req, res) => {};
const deleteFriend = async (req, res) => {};

module.exports = {
  getProfile,
  getDogBreeds,
  getCatBreeds,
  postPet,
  getPetInfo,
  editPetInfo,
  deletePet,
  getFriends,
  addFriend,
  deleteFriend,
};
