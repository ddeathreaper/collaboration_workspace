const express = require("express")
const router = express.Router()
const authMiddleware = require("../auth/auth")
const roomController = require("../controller/roomController")
const whiteboardController = require("../controller/whiteBoardController")

router.post("/createRoom",authMiddleware.authenticate, roomController.createRoom)
router.post("/verifyRoom",authMiddleware.authenticate, roomController.verifyRoom)
router.get("/getRoomId",authMiddleware.authenticate ,roomController.returnRoomId)

router.post("/saveWhiteboard",authMiddleware.authenticate, whiteboardController.saveWhiteboard)
router.get("/loadWhiteboard",authMiddleware.authenticate ,whiteboardController.loadWhiteboard)

router.post("/saveCode",authMiddleware.authenticate,roomController.saveCode)
router.get("/loadCode",authMiddleware.authenticate,roomController.loadCode)
module.exports = router