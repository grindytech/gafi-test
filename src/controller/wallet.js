const dotenv = require("dotenv");
dotenv.config();
const {funded_wallets} = require('../wallet/funded_wallets');

module.exports = {
  create: async function (req, res) {

  },

  funded: async function(req, res) {
    funded_wallets();
    res.status(200);
    res.json("Funded wallets");
  }
}