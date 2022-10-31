
const router = require("express").Router();
const wallet_controller = require("../controller/wallet");

router.route("/create").get(wallet_controller.create);
router.route("/funded").get(wallet_controller.funded);
router.route("/map").get(wallet_controller.map);
router.route("/join").get(wallet_controller.join);
router.route("/leave").get(wallet_controller.leave);

module.exports = router;