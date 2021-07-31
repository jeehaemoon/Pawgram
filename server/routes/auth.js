const router = require("express").Router();

const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { MONGO_URI } = process.env;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const signUp = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  const { username, email, password } = req.body;
  const _id = uuidv4();
  // hash password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const petsArr = [];
  const friendsArr = [];
  const albumArr = [];

  let newAccount = {
    _id,
    username,
    email,
    password: hashedPassword,
    pets: petsArr,
    friends: friendsArr,
    album: albumArr,
  };

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    // get users database
    // check if there is data with either a same username or email
    const user = await db
      .collection("users")
      .findOne({ $or: [{ email: email }, { username: username }] });
    console.log(user);
    // if user already exists, then send a message
    if (user !== undefined) {
      if (user.username === username) {
        res.status(400).json({
          status: 400,
          message: "Username already exists.",
        });
      } else if (user.email === email) {
        res.status(400).json({
          status: 400,
          message: "Email is already being used, go to the Sign In page.",
        });
      }
    }
    // if user doesn't exist
    else {
      // insert the new user into the database
      const newUser = await db.collection("users").insertOne(newAccount);
      res.status(200).json({
        status: 200,
        data: newUser,
        message: "User added.",
      });
    }
  } catch (err) {
    console.log(err);
    // on failure, send
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const postLogIn = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  const { username, email, password } = req.body;

  try {
    await client.connect();
    const db = client.db("data");
    console.log("connected");

    // find user with the same email and username
    const user = await db.collection("users").findOne({
      $and: [{ email: email }, { username: username }],
    });

    if (user !== undefined) {
      //password correct
      const validPass = await bcrypt.compare(password, user.password);
      if (validPass) {
        //create assign token
        jwt.sign({ user }, process.env.TOKEN_SECRET, (err, token) => {
          user.token = token;
          delete user.password;
          res.json(user);
          console.log("LOGGED IN");
        });
      } // if password is incorrect
      else {
        res.status(400).json({
          status: 400,
          message: "Wrong password.",
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "User does not exist.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

// const logOut = async (req, res) => {
//   res.status(200).clearCookie("auth-token").send("cookie cleared");
// };

router.post("/signup", signUp);
router.post("/login", postLogIn);
// router.delete("/logout", logOut);
module.exports = router;
