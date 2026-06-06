const mongoose = require("mongoose")
const Schema = mongoose.Schema

const stickyNoteSchema = new mongoose.Schema({
    text:{
        type:String,
        default: ""
    },
    left:{
        type:String,
        required: true
    },
    top:{
        type:String,
        required: true
    },
    zIndex:{
        type:Number,
        default:1
    }
})

const whiteboardSchema = new Schema({
    roomId:{
        type:String,
        required: true,
        unique: true,
        index: true
    },
    canvasMemory:{
        type:String,
        default: ""
    },
    stickyNotes:[stickyNoteSchema]
},{
    timestamps: true
}
)

module.exports = mongoose.model("Whiteboard",whiteboardSchema)