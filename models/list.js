const mongoose = require('mongoose')

const listSchema = mongoose.Schema({
    listName:String,
    todos:[
        {
            task:String,
            marked:Boolean,
            image:String
        }
    ]
},{timestamps:true})

const List = mongoose.model("lists",listSchema)
module.exports = List