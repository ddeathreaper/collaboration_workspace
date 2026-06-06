const {Server} = require("socket.io")


let io

const roomUsers = {};

const initsocket = server=>{
    io = new Server(server,{
        cors:{
            origin:"*"
        }
    })

    io.on("connection",socket=>{
        console.log(`User connected:${socket.id}`)
        
        
        socket.on("joinRoom",({roomId,userName})=>{
            socket.join(roomId)
            console.log(`${socket.id} joined room:${roomId}`)

            socket.roomId = roomId
            socket.userName = userName

            if(!roomUsers[roomId]){
                roomUsers[roomId] = {}
            }
            roomUsers[roomId][socket.id] = userName
            const activeUsers = Object.values(roomUsers[roomId])
            io.to(roomId).emit("roomUsers",activeUsers)
        })

        socket.on("sendCanvas",data=>{
            socket.to(data.roomId).emit("receiveCanvas",data.canvasMemory)
        })

        socket.on("sendNotes",data=>{
            socket.to(data.roomId).emit("receiveNotes",data.stickyNotes)
        })

        socket.on("sendCode",data=>{
            socket.to(data.roomId).emit("receiveCode",data.code)
        })

        socket.on("disconnect",()=>{
            console.log("User disconnected")
            const {roomId, id} = socket
            if (roomId && roomUsers[roomId] && roomUsers[roomId][id]) {
                const disconnectedUser = roomUsers[roomId][id];
                delete roomUsers[roomId][id];
                if (Object.keys(roomUsers[roomId]).length === 0) {
                    delete roomUsers[roomId];
                } else {
                    const updatedUsersList = Object.values(roomUsers[roomId]);
                    io.to(roomId).emit("roomUsers", updatedUsersList);
                }
            }
        })
    })
    return io
}

const getIO = ()=>{
    if(!io){
        console.log("Socket.io has not been started")
    }
    return io
}

module.exports = {initsocket,getIO}