const Blockchain = require("./blockchain");

const myCoin = new Blockchain();

const previousBlockHash = "ASDASDASDASDASDASDASD";
const nonce = 16166;
const currentBlockData = [
  {
    amount: 10,
    sender: "asdasda",
    recipient: "poaspdoiasd",
  },
  {
    amount: 100,
    sender: "asdasda",
    recipient: "poaspdoiasd",
  },
  {
    amount: 1000,
    sender: "asdasda",
    recipient: "poaspdoiasd",
  },
];

const hash = myCoin.hashBlock(previousBlockHash, currentBlockData, nonce);
console.log("HASH", hash);
