const dotenv = require("dotenv");
dotenv.config();
const { funded_wallets } = require('../wallet/funded_wallets');
const { create_wallets } = require('../wallet/create_wallets');
const { map_addreses, join_pool, leave_pool } = require("../wallet/wallet");

module.exports = {
  create: async function (req, res) {
    console.log("start creating wallets");
    let count = req.query.count;
    create_wallets(count);
    res.status(200);
    res.json("wallets created");
  },

  funded: async function (req, res) {
    console.log("start funding wallets");
    funded_wallets();
    res.status(200);
    res.json("Funded wallets");
  },

  map: async function (req, res) {
    console.log("start mapping wallets");
    map_addreses();
    res.status(200);
    res.json("proof address mapping");
  },

  join: async function (req, res) {
    console.log("start joining pool");
    let pool_id = req.query.pool_id;
    join_pool(pool_id);
    res.status(200);
    res.json("joined pool");
  },

  leave: async function (req, res) {
    console.log("start leaving pool");
    leave_pool();

    res.status(200);
    res.json("leaved pool");
  },

}