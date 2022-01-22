const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const app = express();

const yCoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/blockchain", function (req, res) {
  res.send(yCoin);
});
app.post("/transaction", function (req, res) {
  const { amount, sender, recipient } = req?.body;
  const blockIndex = yCoin.createNewTransaction(amount, sender, recipient);

  res.json({ note: `Transaction will be added in block # ${blockIndex}` });
});
app.get("/mine", function (req, res) {
  res.send("Hello World");
});

app.listen(3000, function () {
  console.log("Listening to port 3000...");
});
