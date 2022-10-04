
const router = require("express").Router();
const tx_controller = require("../controller/tx");

router.route("/create_token").get(tx_controller.create_token);
router.route("/transfer_token").get(tx_controller.transfer_token);
router.route("/approve_token").get(tx_controller.approve_token);
router.route("/tps").get(tx_controller.tps);
router.route("/fee").get(tx_controller.fee);

module.exports = router;