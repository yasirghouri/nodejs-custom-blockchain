const Blockchain = require("./blockchain");

const myCoin = new Blockchain();

myCoin.createNewBlock(123, "ASDASDASD", "ASDASDASDA");
myCoin.createNewBlock(456, "ASDASDASDA", "ASDASDASDAA");
myCoin.createNewBlock(789, "ASDASDASDAA", "ASDASDASDAA");

console.log("MY COIN", myCoin);
console.log("MY COIN", myCoin.getLastBlock());
