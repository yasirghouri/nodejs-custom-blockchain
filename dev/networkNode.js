const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const rp = require("request-promise");

const Blockchain = require("./blockchain");
const app = express();
const yCoin = new Blockchain();
const nodeAddress = uuidv4().split("-").join("");
const port = process.argv[2];

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

app.post("/register-and-broadcast-node", function (req, res) {
  const newNodeUrl = req?.body?.newNodeUrl;
  if (yCoin.netWorkNodes.indexOf(newNodeUrl) == -1)
    yCoin.netWorkNodes.push(newNodeUrl);

  const registerNodesPromises = [];

  yCoin.netWorkNodes.forEach((netWorkNodeUrl) => {
    const requestOptions = {
      uri: netWorkNodeUrl + "/register-node",
      method: "POST",
      body: {
        newNodeUrl,
      },
      json: true,
    };

    registerNodesPromises.push(rp(requestOptions));
  });

  Promise.all(registerNodesPromises)
    .then((data) => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...yCoin.netWorkNodes, yCoin.currentNodeUrl],
        },
        json: true,
      };

      return rp(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: "New node registered with network successfully." });
    });
});

app.post("/register-node", function (req, res) {
  const newNodeUrl = req?.body?.newNodeUrl;
  const nodeNotAlreadyPresent = yCoin.netWorkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = yCoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    yCoin.netWorkNodes.push(newNodeUrl);

  res.json({ note: "New node registered successfully." });
});

app.post("/register-nodes-bulk", function (req, res) {});

app.listen(port, function () {
  console.log(`Listening to port ${port}...`);
});
