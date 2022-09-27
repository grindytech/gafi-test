const router = require("express").Router();

const wallet_route = require('./wallet');


// API routes
router.use("/wallet", wallet_route);

// If no API routes are hit
router.get("*", (req, res) => {
  res.send("Welcome to gafi-test")
});

module.exports = router;