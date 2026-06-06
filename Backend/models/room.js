const mongoose = require("mongoose")
const Schema = mongoose.Schema

const roomSchema = new Schema({
    roomId:{
        type: String,
        required: true,
        unique:true,
        index:true
    },
    password:{
        type: String,
        required: true,
    },
    codeContent:{
        type: String
    },
    whiteboardId:{
        type: Schema.ObjectId,
        ref:"Whiteboard"
        // required: true
    },
    language:{
        type:String,
        required: true
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Room",roomSchema)