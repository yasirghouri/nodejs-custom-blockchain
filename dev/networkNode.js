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
  const newTransaction = req?.body;
  const blockIndex = yCoin.addTransactionToPendingTransactions(newTransaction);

  res.json({ note: `Transaction will be added to block # ${blockIndex}` });
});

app.post("/transaction/broadcast", function (req, res) {
  const { amount, sender, recipient } = req?.body;
  const newTransaction = yCoin.createNewTransaction(amount, sender, recipient);
  yCoin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];

  yCoin.networkNodes.forEach((netWorkNodeUrl) => {
    const requestOptions = {
      uri: netWorkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({ note: "Transaction created and broadcast successfully." });
  });
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

  const newBlock = yCoin.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];

  yCoin.networkNodes.forEach((netWorkNodeUrl) => {
    const requestOptions = {
      uri: netWorkNodeUrl + "/receive-new-block",
      method: "POST",
      body: { newBlock },
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then((data) => {
      const requestOptions = {
        uri: yCoin.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: { amount: 12.5, sender: "00", recipient: nodeAddress },
        json: true,
      };

      return rp(requestOptions);
    })
    .then((data) => {
      res.json({
        note: "New block mined and broadcast successfully",
        block: newBlock,
      });
    });
});

app.post("/receive-new-block", function (req, res) {
  const newBlock = req?.body?.newBlock;
  const lastBlock = yCoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (correctHash && correctIndex) {
    yCoin.chain.push(newBlock);
    yCoin.pendingTransactions = [];
    res.json({ note: "New block received and accepted.", newBlock });
  } else {
    res.json({ note: "New block rejected.", newBlock });
  }
});

app.post("/register-and-broadcast-node", function (req, res) {
  const newNodeUrl = req?.body?.newNodeUrl;
  const nodeNotAlreadyPresent = yCoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = yCoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    yCoin.networkNodes.push(newNodeUrl);

  const registerNodesPromises = [];

  yCoin.networkNodes.forEach((netWorkNodeUrl) => {
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
          allNetworkNodes: [...yCoin.networkNodes, yCoin.currentNodeUrl],
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
  const nodeNotAlreadyPresent = yCoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = yCoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    yCoin.networkNodes.push(newNodeUrl);

  res.json({ note: "New node registered successfully." });
});

app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req?.body?.allNetworkNodes;

  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      yCoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = yCoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
      yCoin.networkNodes.push(networkNodeUrl);
  });

  res.json({ note: "Bulk registration successful." });
});

app.get("/consensus", function (req, res) {
  const requestPromises = [];

  yCoin.networkNodes.forEach((netWorkNodeUrl) => {
    const requestOptions = {
      uri: netWorkNodeUrl + "/blockchain",
      method: "GET",
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLength = yCoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !yCoin.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: "Current chain has not been replaced.",
        chain: yCoin.chain,
      });
    } else {
      yCoin.chain = newLongestChain;
      yCoin.pendingTransactions = newPendingTransactions;

      res.json({ note: "This chain has been replaced.", chain: yCoin.chain });
    }
  });
});

app.get("/block/:blockHash", function (req, res) {
  const blockHash = req?.params?.blockHash;
  const correctBlock = yCoin.getBlock(blockHash);

  res.json({ block: correctBlock });
});

app.get("/transaction/:transactionId", function (req, res) {
  const transactionId = req.params.transactionId;
});

app.get("/address/:address", function (req, res) {
  const address = req.params.address;
});

app.listen(port, function () {
  console.log(`Listening to port ${port}...`);
});
