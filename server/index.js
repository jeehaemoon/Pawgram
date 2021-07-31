"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const authRoute = require("./routes/auth");
const factRoute = require("./routes/facts");
//connect to
const PORT = 4000;
//import routes

const {
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
} = require("./handlers");
const { verifyToken } = require("./verifyToken");

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))
  /////////////// REST ENDPOINTS ////////////////
  .use("/api/auth", authRoute)

  .use(verifyToken)

  .get("/profile", getProfile)

  //pet endpoints
  .get("/dogbreeds", getDogBreeds)
  .get("/catbreeds", getCatBreeds)
  .post("/pet", postPet)
  .get("/pet/:_id", getPetInfo)
  .put("/pet/edit", editPetInfo)
  .put("/pet/delete", deletePet)

  //friends endpoints
  .get("/friends", getFriends)
  .post("/friends/add", addFriend)
  .put("/friends/delete", deleteFriend)

  .use("/facts", factRoute)

  //////////////////////////////////////////////

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
