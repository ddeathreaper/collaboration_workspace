const Whiteboard = require("../models/whiteboard")
const Room = require("../models/room")
const JWT = require("jsonwebtoken")


const saveWhiteboard = async(req,res)=>{
    try {
        const roomToken = req.headers["authorization"]
        const extracted = JWT.verify(roomToken,process.env.JWT_SECRET_KEY)
        const roomId = extracted.roomId
        if(!roomId){
            return res.status(401).send("Token not found")
        }
        const room = await Room.findOne({roomId:roomId})
        if(!room){
            return res.status(404).send("RoomId not matched")
        }
        const {canvasMemory, stickyNotes} = req.body

        const whiteboard = await Whiteboard.findOne({roomId:roomId})
        if(!whiteboard){
            await Whiteboard.create({
                roomId:roomId,
                canvasMemory:canvasMemory,
                stickyNotes:stickyNotes
            })
        }else{
            whiteboard.canvasMemory = canvasMemory
            whiteboard.stickyNotes = stickyNotes
            await whiteboard.save()
        }
        
        res.status(200).send("Data updated")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}



const loadWhiteboard = async(req,res)=>{
    try {
        const roomToken = req.headers["authorization"]
        const extracted = JWT.verify(roomToken, process.env.JWT_SECRET_KEY)
        const roomId = extracted.roomId
        if(!roomId){
            return res.status(401).send("Token not found")
        }
        const room = await Room.findOne({roomId:roomId})
        if(!room){
            return res.status(404).send("Room not found")
        }

        const whiteboard = await Whiteboard.findOne({roomId:roomId})

        res.status(200).json({whiteboard:whiteboard})

    } catch (error) {
        console.log(error)
        res.status(500).send("Server side error")
    }
}

module.exports = {saveWhiteboard,loadWhiteboard}