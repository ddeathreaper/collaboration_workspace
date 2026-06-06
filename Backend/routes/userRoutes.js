const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")

router.post("/addUser",userController.addUser)
router.post("/verifyUser",userController.verifyUser)
router.get("/permit",userController.permit)

module.exports = router