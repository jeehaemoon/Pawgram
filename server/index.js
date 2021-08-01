"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const authRoute = require("./routes/auth");
const factRoute = require("./routes/facts");
//connect to
const PORT = 4000;
//import routes
const {
  getDogBreeds,
  getCatBreeds,
  postPet,
  getPetInfo,
  editPetInfo,
  deletePet,
} = require("./handlers/pet");
const { getFriends, addFriend, deleteFriend } = require("./handlers/friends");
const {
  postPicture,
  getPictures,
  getPicture,
  deletePost,
} = require("./handlers/album");
const { getProfile } = require("./handlers/profile");
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

  //album endpoints

  .post("/picture", upload.single("productImage"), postPicture)
  .get("/pictures", getPictures)
  .get("/pictures/:_id", getPicture)
  .put("/delete-post/:_id", deletePost)

  .use("/facts", factRoute)

  //////////////////////////////////////////////

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
