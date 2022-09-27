
const router = require("express").Router();
const wallet_controller = require("../controller/wallet");

router.route("/create").get(wallet_controller.create);
router.route("/funded").get(wallet_controller.funded);

module.exports = router;