if (typeof localStorage === 'undefined') {
    todoList = [];
}

let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

renderTodoList();

function renderTodoList(){
    let todoListHtml = '';

    for (let i = 0; i < todoList.length; i++) {
        const todoObject = todoList[i];
        const name = todoObject.name;
        const date = todoObject.date;

        const html = `
            <div class="todo-item">
                <div>${name}</div>
                <div>${date}</div>
                <button class="delete-btn" onclick="todoList.splice(${i}, 1); renderTodoList();">Delete</button>
            </div>
        `;

        todoListHtml += html;
    }

    document.getElementById('todoList').innerHTML = todoListHtml;

    localStorage.setItem('todoList', JSON.stringify(todoList));
}



function addTodo(){
    const todoInputElement = document.getElementById('todoInput');
    const todoDateElement = document.getElementById('todoDate');

    const date = todoDateElement.value;
    const name = todoInputElement.value;

    if (name.trim() === "") {
        alert("Please enter a todo item.");
        return;
    }

    const todoObject = {
        name,
        date
    };

    todoList.push(todoObject);

    renderTodoList();

    todoInputElement.value = '';
    todoDateElement.value = '';

}

function clearAllTodos() {
    if (confirm("Are you sure you want to clear the todo list?")) {
        todoList = [];
        renderTodoList();
    }
}