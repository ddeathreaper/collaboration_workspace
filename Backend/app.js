const express = require("express")
const app = express()
require('dotenv').config()
const cors = require("cors")
const mongoose = require("mongoose")

const http = require("http")
const {initsocket} = require("./socket")

const userRoutes = require("./routes/userRoutes")
const roomRoutes = require("./routes/roomRoutes")

app.use(express.json({limit: "50mb"}))
app.use(cors())


app.use("/user",userRoutes)
app.use("/room",roomRoutes)


const server = http.createServer(app)

initsocket(server)


mongoose.connect(process.env.MONGO_URI).then(res=>{
    console.log("Mongo Connected")
    server.listen(process.env.PORT || 3000,"0.0.0.0",()=>{
    console.log("Server is running")
    })
}).catch(err=>{
    console.log(err)
})