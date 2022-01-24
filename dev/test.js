const Blockchain = require("./blockchain");

const yCoin = new Blockchain();

const blockchain = {
  chain: [
    {
      index: 1,
      timestamp: 1643032410938,
      transactions: [],
      nonce: 100,
      previousBlockHash: "0",
      hash: "0",
    },
    {
      index: 2,
      timestamp: 1643032539490,
      transactions: [],
      nonce: 18140,
      previousBlockHash: "0",
      hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    },
    {
      index: 3,
      timestamp: 1643032561806,
      transactions: [
        {
          transactionId: "ad46cc13b0de45bfbfc0c618320cfed1",
          amount: 12.5,
          sender: "00",
          recipient: "9afe76938b0d44c2b6071e95994fa03a",
        },
        {
          amount: 10,
          sender: "Yasir",
          recipient: "Eric",
        },
        {
          amount: 100,
          sender: "Yasir",
          recipient: "Eric",
        },
        {
          amount: 1000,
          sender: "Yasir",
          recipient: "Eric",
        },
      ],
      nonce: 45340,
      previousBlockHash:
        "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      hash: "0000f2049d535a575cae24cfebf47343aea2de70d47ed9740125245f2a963ebc",
    },
  ],
  pendingTransactions: [
    {
      transactionId: "3b8f4cc207f64d36a9dfe9032106f1cb",
      amount: 12.5,
      sender: "00",
      recipient: "9afe76938b0d44c2b6071e95994fa03a",
    },
  ],
  currentNodeUrl: "http://localhost:3001",
  networkNodes: [],
};

console.log("chainIsValid", yCoin.chainIsValid(blockchain.chain));
