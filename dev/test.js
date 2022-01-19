const Blockchain = require("./blockchain");

const myCoin = new Blockchain();

myCoin.createNewBlock(123, "HAHA", "HEHE");
myCoin.createNewTransaction(5, "John", "Cena");
myCoin.createNewBlock(123, "HEHE", "HOHO");
myCoin.createNewTransaction(5, "John", "Cena");
myCoin.createNewTransaction(5, "John", "Cena");
myCoin.createNewTransaction(5, "John", "Cena");
myCoin.createNewBlock(123, "HEHE", "HOHO");

console.log("MY COIN", myCoin);
