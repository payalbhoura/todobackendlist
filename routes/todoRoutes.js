const todoRoutes = require("express")()
const path = require('path')
const {
    showLoginPage,
    showSignupPage,
    makeTodo,
    getAllTodos,
    markTodo,
    deleteTodo,
    editTodo,
    loginUser,
    signupUser
} = require("../controllers/todoControllers")

todoRoutes.route("/login")
    .get(showLoginPage) //send login page 
    .post(loginUser) //login user

todoRoutes.route("/signup")
    .get(showSignupPage) //send signup page
    .post(signupUser) //create a new user account

todoRoutes.get('/', (req, res) => {
    res.sendFile(path.resolve("views/home.html"))//send homepage to user
})

todoRoutes.route("/todo")
    .get(getAllTodos) //send all todos to client
    .post(makeTodo) //make a new Todo or list
    .patch(markTodo) //marrk a todo
    .delete(deleteTodo) //delete a todo
    .put(editTodo) // edit a todo

module.exports = todoRoutes