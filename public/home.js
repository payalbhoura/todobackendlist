let arr = [];
let currList = ""
let currListId = ""
const todoForm = document.getElementById("todo-form")
const todoContainer = document.getElementById("todo-container")

document.getElementById("showNewListForm").addEventListener("click", (e) => {
    const form = document.getElementById("list-form")
    if (form.style.display == "none") {
        form.style.display = 'flex'
    } else {
        form.style.display = "none"
    }
})

document.getElementById("addNewList").addEventListener("click", () => {
    const drop1 = document.getElementById("showList")
    const listName = document.getElementById("list_input")
    if (listName.value.length < 4) {
        alert("List name should be atleast 5 chacter long")
        return
    }
    const data = {
        _id: Date.now(),
        listName: listName.value,
        todos: []
    }
    fetch("/todo", {
        method: "post",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ listName: listName.value })
    })
        .then((result) => {
            return result.json()
        })
        .then(res => console.log(res))
        .catch((err) => {
            console.log(err);
        });
    if (createNewList(data)) {
        alert("new list created")
        drop1.appendChild(createOption(listName.value))
        listName.value = ""
        if (arr.length > 0 && currList == "") {
            currList = data.listName
            todoForm.style.display = "flex"
        }
    } else {
        alert("List with this name already exists")
        return;
    }
    console.log(arr);

})

document.getElementById('addNewTodo').addEventListener('click', () => {
    const task = document.getElementById("todo_input")
    const image = document.getElementById("todo_pic")
    const todo = {
        _id: Date.now(),
        task: task.value,
        marked: false
    }
    const formData = new FormData()
    formData.append("listName",currList)
    formData.append("task",task.value)
    formData.append("image",image.files[0])
    console.log(formData);
    fetch("/todo", {
        method: "post",
        body: formData
    })
        .then(r => r.json())
        .then(d => {
            const index = arr.findIndex(list => list.listName == currList)
            arr[index].todos.push(d)
            createTodo(d)
        })
        .catch(err => console.log(err))

})

document.getElementById("showList").addEventListener("change", (e) => {
    currList = e.target.value
    todoContainer.innerHTML = ""
    showTodosOfList(currList)
})

function createOption(name) {
    const op = document.createElement("option")
    op.value = name
    op.innerText = name
    return op
}

function createNewList(list) {
    const index = arr.findIndex(item => item.listName == list.listName)
    console.log(index);
    if (index < 0) {
        arr.push(list)
        return true
    }
    return false
}

function showTodosOfList(listname) {
    const index = arr.findIndex(list => list.listName == listname)
    arr[index].todos.forEach(todo => {
        createTodo(todo)
    });
}

function createTodo(todo) {
    const div = document.createElement("div")
    div.id = `todo-${todo._id}`
    div.className = "todo-item"

    const chkbox_cheked = `<input type="checkbox" onchange="markTodo('${todo._id}')" checked/>`
    const chkbox_uncheked = `<input type="checkbox" onchange="markTodo('${todo._id}')"/>`

    const p_normal = `<p id="txt-${todo._id}">${todo.task}</p>`
    const p_lineThrough = `<p id="txt-${todo._id}" style="text-decoration:line-through" >${todo.task}</p>`

    div.innerHTML = `
                        ${todo.marked ? p_lineThrough : p_normal}
                        <div class="actions">
                        <img class="todoimg" alt="sorry image cant be print" src="/${todo.image}"/>
                            <button onclick="deleteTodo('${todo._id}')">X</button>
                            <button onclick="editTodo('${todo._id}')">edit</button>
                            ${todo.marked ? chkbox_cheked : chkbox_uncheked}
                        </div>`

    todoContainer.appendChild(div)
}

function deleteTodo(id) {
    fetch("/todo?listName=" + currList + "&tid=" + id, { method: "DELETE" })
        .then(res => {
            if (res.status != 200) {
                alert('Something went wrong')
                return
            }
            const index = arr.findIndex(list => list.listName == currList)
            const newTodos = arr[index].todos.filter(todo => todo._id != id)
            arr[index].todos = [...newTodos]
            document.getElementById(`todo-${id}`).remove()
        })
        .catch(err => console.log(err))
}

function markTodo(id) {
    let status = event.target.checked
    fetch("/todo?listName=" + currList + "&tid=" + id + "&status="+status, {
        method: "PATCH"
    })
        .then((res) => {
            if (res.status == 200) {
                const index = arr.findIndex(list => list.listName == currList)
                todoIndex = arr[index].todos.findIndex(todo => todo._id == id)
                arr[index].todos[todoIndex].status = status
                const p = document.getElementById(`txt-${id}`)
                if (status){
                    p.style.textDecoration = "line-through"
                } else {
                    p.style.textDecoration = "none"
                }
            } else {
                alert("Something went wrong")
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function editTodo(id) {
    const newTask = prompt("Enter new task")
    if (newTask == "") {
        alert("Please enter todo")
        return
    }
    fetch("/todo?listName=" + currList + "&tid=" + id, {
        method: "PUT",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ task: newTask })
    })
        .then(res => {
            if (res.status != 200) {
                alert("Something went wrong")
                return
            }
            const index = arr.findIndex(list => list.listName == currList)
            todoIndex = arr[index].todos.findIndex(todo => todo._id == id)
            arr[index].todos[todoIndex].task = newTask
            const p = document.getElementById(`txt-${id}`)
            p.innerText = newTask
        })
        .catch((err) => {
            console.log(err);
        });
}

window.addEventListener("load", () => {
    fetch("/todo")
        .then(res => res.json())
        .then(lists => {
            arr = [...lists]
            if (arr.length > 0 && currList == "") {
                currList = lists[0].listName
                todoForm.style.display = "flex"
            }
            lists.forEach(list => {
                document.getElementById("showList").appendChild(createOption(list.listName))
            })
            lists[0].todos.forEach(todo => {
                createTodo(todo);
            })
        })
        .catch(err => console.log(err))
})

