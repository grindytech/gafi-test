const dotenv = require("dotenv");
dotenv.config();
const {funded_wallets} = require('../wallet/funded_wallets');
const {create_wallets} = require('../wallet/create_wallets');

module.exports = {
  create: async function (req, res) {
    console.log("create");

    let count = req.query.count;
    console.log("count: ", count);
    create_wallets(count);
    res.status(200);
    res.json("wallets created");
  },

  funded: async function(req, res) {
    funded_wallets();
    res.status(200);
    res.json("Funded wallets");
  }
}