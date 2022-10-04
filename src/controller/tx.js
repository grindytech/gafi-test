const dotenv = require("dotenv");
dotenv.config();

const {create_tokens, get_tps, get_fee_detail} = require('../tx/tx');

module.exports = {
  spam: async function (req, res) {
      let count = req.query.count;
      create_tokens(count);
      res.status(200);
      res.json("created tokens");
  },

  tps: async function (req, res) {
    let count = req.query.count;

    get_tps(count);

    res.status(200);
    res.json("tps");
  },

  fee: async function (req, res) {
    let block = req.query.block;

    get_fee_detail(block);

    res.status(200);
    res.json("get fee detail");
  },
}