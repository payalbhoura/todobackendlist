const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    password:String,
    name:String,
    profileImage:String
})

const User = mongoose.model("todo_users",userSchema)
module.exports = User
