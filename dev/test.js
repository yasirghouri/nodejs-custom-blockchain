const Blockchain = require("./blockchain");

const myCoin = new Blockchain();

const previousBlockHash = "ASDASDASDASDASDASDASD";
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

const hash = myCoin.hashBlock(previousBlockHash, currentBlockData, 135411);
console.log("hash", hash);
