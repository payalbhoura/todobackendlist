require('dotenv').config()
const express = require("express")
const session = require("express-session")
const multer = require("multer")
const db = require("./models/db")
const server = express()
const port = 2000
// const jwt =require("jsonwebtoken")

const upload = multer({dest:"uploads/"})

server.use(upload.any())
server.use(express.json())// jb browser request krega server ko //ye handle krega "body:JSON.stringify({})"// recieve hoga req.body me
server.use(express.urlencoded({extended:true})) // ye handle krega urlencoded data ko// for ex. data sent with form tag

server.use(express.static("public/"))
server.use(express.static("uploads/"))

server.use(session({
    resave:false,
    saveUninitialized:false,
    secret:"my secret"
}))

server.use((req,res,next)=>{
    console.log("route->",req.url);
    console.log("method->",req.method);
    console.log("body->",req.body);
    console.log("files->",req.files);
    next()
}) // custom middle ware //using just for printing route, method, body, files

const todoRoutes = require("./routes/todoRoutes")
server.use("/",todoRoutes)

db.init()
.then((result) => {
    server.listen(port,(err)=>{
        if(err){
            console.log("err->",err);
            return
        }
        console.log(`server started at port ${port}`);
    })
}).catch((err) => {
    console.log(err);
});