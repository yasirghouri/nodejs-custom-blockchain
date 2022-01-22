const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/blockchain", function (req, res) {
  res.send("Hello Blockchain");
});
app.post("/transaction", function (req, res) {
  console.log(req.body);
  res.send(`The amount of transaction is ${req?.body?.amount} coins.`);
});
app.get("/mine", function (req, res) {
  res.send("Hello World");
});

app.listen(3000, function () {
  console.log("Listening to port 3000...");
});
