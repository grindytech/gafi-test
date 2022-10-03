
const router = require("express").Router();
const tx_controller = require("../controller/tx");

router.route("/spam").get(tx_controller.spam);
router.route("/tps").get(tx_controller.tps);

module.exports = router;