const express = require("express")
const router = express.Router()
const whiteBoardController = require("../controller/whiteBoardController")
const authMiddleware = require("../auth/auth")

router.post("/saveWhiteboard",authMiddleware.authenticate,whiteBoardController.saveWhiteboard)
// router.get("/getWhiteboard",whiteBoardController.getWhiteboard)

module.exports = router