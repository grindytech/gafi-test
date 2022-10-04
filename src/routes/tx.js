
const router = require("express").Router();
const tx_controller = require("../controller/tx");

router.route("/spam").get(tx_controller.spam);
router.route("/tps").get(tx_controller.tps);
router.route("/fee").get(tx_controller.fee);

module.exports = router;