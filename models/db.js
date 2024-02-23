const mongoose = require('mongoose')
 
const serverUrl = "mongodb://localhost:27017"
module.exports.init = async()=>{
    await mongoose.connect(process.env.MONGO_URL)
}