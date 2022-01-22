const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const Blockchain = require("./blockchain");
const app = express();

const yCoin = new Blockchain();
const nodeAddress = uuidv4().split("-").join("");

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
  const lastBlock = yCoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: yCoin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };

  const nonce = yCoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = yCoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  yCoin.createNewTransaction(12.5, "00", nodeAddress);

  const newBlock = yCoin.createNewBlock(nonce, previousBlockHash, blockHash);

  res.json({ note: "New block mined successfully", block: newBlock });
});

app.listen(3000, function () {
  console.log("Listening to port 3000...");
});
