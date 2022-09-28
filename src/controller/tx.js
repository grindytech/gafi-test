const dotenv = require("dotenv");
dotenv.config();

const {create_tokens} = require('../tx/tx');

module.exports = {
  spam: async function (req, res) {
      let count = req.query.count;
      create_tokens(count);
      res.status(200);
      res.json("created tokens");
  },
}