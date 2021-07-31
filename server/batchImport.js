const { MongoClient } = require("mongodb");

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
const batchImport = async (req, res) => {
  const client = await new MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("data");
    console.log("connected!");

    const dataDog = await request(optionsApiDogBreed);
    const dataCat = await request(optionsApiCatBreed);

    //insert  data into MONGODB
    const dogs = await db.collection("dogs").insertMany(dataDog);
    assert.equal(dogs.length, dataDog.insertedCount);
    const cats = await db.collection("cats").insertMany(dataCat);
    assert.equal(cats.length, dataCat.insertedCount);
    // On success, send
    console.log("success");
  } catch (err) {
    console.log(err.stack);
  }
  // TODO: close...
  client.close();
  console.log("disconnected!");
};
batchImport();
