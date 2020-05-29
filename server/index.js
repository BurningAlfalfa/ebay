const express = require("express");
const mongod = require("mongodb");
const bodyParser = require("body-parser");

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb";
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/add-item", async (req, res) => {
  const {
    inputValue: text,
    selectValue: type,
    descriptionValue: description,
  } = req.body;
  const itemObj = {
    text,
    type,
    description,
  };
  await insert(itemObj);
  res.status(200).end();
});
app.post("/buy-item", async (req, res) => {
  //after i clik buy what is done with the infomation
  const item = req.body;
  await insertPurchasedItem(item);
  await db.collection("items").deleteOne(item.id);
  res.status(200).end();
});

app.get("/purchasedItems", (req, res) => {
  // console.log(req);
  db.collection("purchasedItems")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.send(result);
      console.log(result);
    });
});
app.get("/items", (req, res) => {
  // console.log(req);
  db.collection("items")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.send(result);
      console.log(result);
    });
});
let db;
MongoClient.connect(url, onConnect);
function onConnect(err, dbo) {
  if (err) throw err;
  console.log("Database created!");
  db = dbo.db("mydb");
}
function insert(item) {
  return new Promise((resolve) => {
    db.collection("items").insertOne(item, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      resolve(res);
    });
  });
}
function insertPurchasedItem(purchasedItem) {
  return new Promise((resolve) => {
    db.collection("purchasedItems").insertOne(purchasedItem, function (
      err,
      res
    ) {
      if (err) throw err;
      console.log("1 sold document inserted");
      resolve(res);
    });
  });
}
app.listen(8000, () => console.log("server is listening"));
