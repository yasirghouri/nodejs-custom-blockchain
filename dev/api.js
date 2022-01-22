const express = require("express");
const app = express();

app.get("/blockchain", function (req, res) {
  res.send("Hello World");
});
app.post("/transaction", function (req, res) {
  res.send("Hello World");
});
app.get("/mine", function (req, res) {
  res.send("Hello World");
});

app.listen(3000, function () {
  console.log("Listening to port 3000...");
});
