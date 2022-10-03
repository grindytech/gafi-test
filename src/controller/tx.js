const dotenv = require("dotenv");
dotenv.config();

const {create_tokens, get_tps} = require('../tx/tx');

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
  }
}