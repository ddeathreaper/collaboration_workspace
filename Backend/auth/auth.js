const jwt = require("jsonwebtoken")
const User = require("../models/user")


const authenticate = (req, res, next)=>{
    try {
        const token = req.header("authentication")
        // console.log(token)

        const extracted = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userid = extracted.userId

        User.findById({_id:userid}).then(user=>{
            if(!user){
                return res.status(401).json({success: false, message: "User not found"})
            }
            req.user = user
            next()
        }).catch(err=>{
            console.log(err)
        })

    } catch (error) {
        console.log(error.message)
        return res.status(401).json({success: false})
    }
}

module.exports = {authenticate}