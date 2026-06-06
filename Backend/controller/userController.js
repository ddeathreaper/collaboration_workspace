const User = require("../models/user")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

function generateToken(id){
    return JWT.sign({userId:id}, process.env.JWT_SECRET_KEY)
}

const addUser = async (req,res)=>{
    try {
        const {name, email, password} = req.body
        const saltRounds = 10

        const hash = await bcrypt.hash(password,saltRounds)

        await User.create({
            userName: name,
            email:email,
            password:hash
        })
        console.log(`User ${name} created`)
        res.status(201).send("User created")

    } catch (error) {
        console.log(error)
        res.status(500).send("Server side error")
    }
}



const verifyUser = async(req,res)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email:email})

        if(!user){
            return res.status(404).send("User not found")
        }

        const validated = await bcrypt.compare(password,user.password)
        if(!validated){
            return res.status(401).send("Password mismatch")
        }

        res.status(200).json({message:"User logged in successfully", token:generateToken(user._id),userName:user.userName})
    } catch (error) {
        console.log(error)
        res.status(500).send("Server side error")
    }
}

const permit = async(req,res)=>{
    try {
        const token = req.headers["authentication"]
        const extracted = JWT.verify(token,process.env.JWT_SECRET_KEY)
        const userId = extracted.userId
        const user = await User.findById({_id:userId})
        if(user){
            res.status(200).send("User found")
        }else{
            res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).send("Server side error")
    }
}

module.exports = {addUser, verifyUser,permit}