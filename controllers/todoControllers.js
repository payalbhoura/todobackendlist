const path = require("path")
const List = require("../models/list")
const User = require("../models/user")

function showLoginPage(req, res) {
    res.sendFile(path.resolve("views/login.html"))
}

function showSignupPage(req, res) {
    res.sendFile(path.resolve("views/signup.html"))
}

function loginUser(req, res){
    const email = req.body.email
    const password = req.body.email
    User.findOne({email:email})
    .then((user) => {
        if(!user){
            res.status(404).end()
            return
        }
        if(user.password==password){
            res.redirect("/")
        } else {
            res.status(401).end()
        }
    }).catch((err) => {
        res.status(500).send(err)
    });
}

function signupUser(req, res) {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const profileImage = req?.files[0]?.filename
    User.create({email,password,name,profileImage})
    .then((result) => {
        if(result.code==11000){
            res.status(409).end()
            return
        }
        res.redirect("/login")
    }).catch((err) => {
        console.log(err);
    });
}

function getAllTodos(req, res) {
    List.find({})
        .then((result) => {
            res.json(result)
        }).catch((err) => {
            res.status(500).send(err)
        });
}

function makeTodo(req, res) {
    const listName = req.body.listName
    const task = req.body.task
    if (!task) {
        List.create({ listName: listName, todos: [] })
        .then((result) => {
            res.status(200).json(result)
            return
        })
        .catch((err) => {
            res.status(500).send(err)
            return
        });
    } else {
        const todo = {
            task: task,
            marked: false,
            image: req.files[0].filename
        }
        List.findOneAndUpdate({ listName: listName }, { '$push': { todos: todo } })
        .then((result) => {
            console.log("result->",result.todos[result.todos.length-1]);
            res.status(200).json(result.todos[result.todos.length-1])
        })
        .catch((err) => {
            res.status(500).send(err)
        });
    }
}

function markTodo(req, res) {
    const listName = req.query.listName
    const todoId = req.query.tid
    const status = req.query.status
    console.log(status);
    console.log(req.query);
    List.updateOne({ "listName": listName, "todos._id": todoId },{ $set: { "todos.$.marked":status }},{new:true} )//jo find out kiya tha 
        .then((result) => {
            console.log(result);
            if(result.modifiedCount>0){
                res.status(200).end()
            }
        }).catch((err) => {
            res.status(500).send(err)
        });
}

function deleteTodo(req, res) {
    const todoId = req.query.tid
    listName = req.query.listName
    List.updateOne({listName:listName},{$pull:{"todos":{"_id":todoId}}})
    .then((result) => {
        if(result.modifiedCount>0){
            res.status(200).end()
        } 
    }).catch((err) => {
        console.log(err);
    });
}

function editTodo(req, res) {
    const newTask = req.body.task
    const listName = req.query.listName
    const todoId = req.query.tid
    console.log(req.query);
    List.updateOne({"listName":listName,"todos._id":todoId},{$set:{"todos.$.task":newTask}},{new:true})
    .then((result) => {
        if(result.modifiedCount>0){
            res.status(200).end()
        }
    }).catch((err) => {
        res.status(500).send(err)
        console.log(err);
    });
}

module.exports = {
    showLoginPage,
    showSignupPage,
    getAllTodos,
    makeTodo,
    markTodo,
    deleteTodo,
    editTodo,
    signupUser,
    loginUser
}