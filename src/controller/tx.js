const dotenv = require("dotenv");
dotenv.config();

const {create_tokens} = require('../tx/tx');

module.exports = {
  spam: async function (req, res) {
      await create_tokens();
      res.status(200);
      res.json("created tokens");
  },
}