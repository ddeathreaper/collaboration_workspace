const Room = require("../models/room")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

function generateToken(id){
    return JWT.sign({roomId:id}, process.env.JWT_SECRET_KEY)
}

const createRoom = async (req,res)=>{
    try {
        const {roomId, password, codeContent, whiteboardId, language} = req.body

        const room = await Room.findOne({roomId:roomId})
        if(room){
            return res.status(400).json({message:"Room already exists"})
        }
        const saltrounds = 10
        const hash = await bcrypt.hash(password, saltrounds)

        await Room.create({
            roomId,
            password:hash,
            codeContent,
            whiteboardId,
            language
        })

        const roomToken = generateToken(roomId)

        console.log("Room created")
        res.status(200).json({message:"Room created Successfully",roomId:roomId, roomToken:roomToken})
    } catch (error) {
        console.log(error)
        res.status(500).send("Server side error")
    }
}

const verifyRoom = async(req,res)=>{
    try {
        const {roomId, password} = req.body
        
        const room =await Room.findOne({roomId:roomId})
        if(!room){
            return res.status(404).send("Room not found")
        }

        const validated = await bcrypt.compare(password,room.password)
        if(!validated){
            return res.status(401).send("Password mismatch")
        }
        res.status(200).json({message:"Joined room",joinedRoom:true, roomToken:generateToken(room.roomId)})
    } catch (error) {
        console.log(error)
        res.status(500).send("Server side error")
    }
}



const returnRoomId = async(req,res)=>{
    try {
        const roomToken = req.headers["authorization"]
        const extracted = JWT.verify(roomToken,process.env.JWT_SECRET_KEY)
        const roomId = extracted.roomId

        const room = await Room.findOne({roomId:roomId})
        if(!room){
            return res.status(404).send("Room not found")
        }

        res.status(200).json({message:"RoomId found",roomId:roomId})
    } catch (error) {
        console.log(error)
        res.status(500).send("Server side error")
    }
}


const saveCode = async(req,res)=>{
    try {
        const roomToken = req.headers["authorization"]
        const extracted = JWT.verify(roomToken,process.env.JWT_SECRET_KEY)
        const roomId = extracted.roomId
        if(!roomId){
            return res.status(404).send("Room id not found")
        }
        const room = await Room.findOne({roomId:roomId})

        if(!room){
            return res.status(404).send("Room not found")
        }
        const {codeContent, language} = req.body

        room.codeContent = codeContent
        room.language = language
        await room.save()

        res.status(200).send("Saved successfully")

    } catch (error) {
        console.log(error)
        res.status(500).send("Serverside error")
    }
}


const loadCode = async(req,res)=>{
    try {
        const roomToken = req.headers["authorization"]
        const extracted = JWT.verify(roomToken,process.env.JWT_SECRET_KEY)
        const roomId = extracted.roomId
        if(!roomId){
            return res.status(404).send("Room id not found")
        }

        const room = await Room.findOne({roomId:roomId})

        const codeContent = room.codeContent
        res.status(200).json({codeContent:codeContent})
    } catch (error) {
        console.log(error)
        res.status(500).send("Serverside error")
    }
}

module.exports = {createRoom, verifyRoom, returnRoomId,saveCode,loadCode}