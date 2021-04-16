const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheckEdit);
filterOption.addEventListener('click', filterTodo)

function addTodo(event) {
    event.preventDefault();

    if (todoInput.value === '') {
        console.log('The input is empty');
    } else {
        if (duplicateTodoCheck(todoInput.value) != 'duplicate') {
            const todoDiv = document.createElement('div');
            todoDiv.classList.add('todo');

            const completedButton = document.createElement('button');
            completedButton.innerHTML = '<i class="fas fa-check"></i>';
            completedButton.classList.add('complete-btn');
            todoDiv.appendChild(completedButton);

            const date = new Date();
            const arr = date.toString().split(' ').reverse();
            const year = arr.splice(-4, 1);
            const newDate = arr.splice(-3, 2).concat(year).join(' ');
            const newTodo = document.createElement('li');
            const span = document.createElement('span');
            span.classList.add('item-date');
            newTodo.innerHTML = '<textarea class="item-text" value disabled></textarea>';
            span.innerText = newDate;
            newTodo.firstChild.id = todoInput.value;
            newTodo.firstChild.value = todoInput.value;
            newTodo.classList.add('todo-item');
            newTodo.appendChild(span);
            todoDiv.appendChild(newTodo);

            saveLocalTodos(todoInput.value, newDate);

            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="far fa-edit"></i>';
            editButton.classList.add('edit-btn');
            todoDiv.appendChild(editButton);

            const trashButton = document.createElement('button');
            trashButton.innerHTML = '<i class="far fa-trash-alt"></i>';
            trashButton.classList.add('trash-btn');
            todoDiv.appendChild(trashButton);

            todoList.appendChild(todoDiv);

            todoInput.value = '';
        }
    }
}

function deleteCheckEdit(event) {
    const item = event.target;

    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;
        todo.classList.add('fall');
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', function () {
            todo.remove();
        })
    }

    if (item.classList[0] === 'complete-btn') {
        const todo = item.parentElement.children[1];
        todo.classList.toggle('completed');
        item.classList.toggle('checboxCompleted');
        markCompleted(todo);
    }

    if (item.classList[0] === 'edit-btn') {
        const todo = item.parentElement.children[1];
        if(item.firstChild.classList[1] === 'fa-edit') {
            todo.firstChild.disabled = false;
            todo.firstChild.focus();
            item.firstChild.style.display = 'none';
            item.innerHTML = '<i class="fas fa-check"></i>';
        } else {
            if (todo.firstChild.value === '') {
                console.log('The input is empty');
            } else {
                todo.firstChild.disabled = true;
                item.firstChild.style.display = 'none';
                item.innerHTML = '<i class="far fa-edit"></i>';
                editLocalTodos(todo);
            }
        }
    }
}

function filterTodo(event) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        
        switch (event.target.dataset.value) {
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'completed':
                if (todo.children[1].classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if (!todo.children[1].classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
        }
    });
}

function saveLocalTodos(todo, date) {
    let todos;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    let data = {
        todo: todo,
        status: 'uncompleted',
        id: todo,
        date: date
    };
    todos.push(data);

    let all = filterOption.firstElementChild.lastChild;
    let uncompleted = filterOption.lastElementChild.lastChild;
    let allCount = todos.length;
    
    all.textContent = allCount;
    uncompleted.textContent++;

    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos;
    let all = filterOption.firstElementChild.lastChild;
    let completed = filterOption.children[1].lastChild;
    let uncompleted = filterOption.lastElementChild.lastChild;

    let completedCount = 0;
    let uncompletedCount = 0;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function (todo) {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add('complete-btn');
        todoDiv.appendChild(completedButton);

        const newTodo = document.createElement('li');
        const span = document.createElement('span');
        span.classList.add('item-date');
        span.innerText = todo['date'];
        newTodo.innerHTML = '<textarea class="item-text" value disabled></textarea>';
        newTodo.firstChild.id = todo['id'];
        newTodo.firstChild.value = todo['todo'];
        newTodo.classList.add('todo-item');
        newTodo.appendChild(span);
        todoDiv.appendChild(newTodo);

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="far fa-edit"></i>';
        editButton.classList.add('edit-btn');
        todoDiv.appendChild(editButton);

        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="far fa-trash-alt"></i>';
        trashButton.classList.add('trash-btn');
        todoDiv.appendChild(trashButton);

        todoList.appendChild(todoDiv);

        let status = todo.status;
        if (status === 'completed') {
            completedCount++;
            todoDiv.children[1].classList.toggle('completed');
            completedButton.classList.toggle('checboxCompleted');
        } else {
            uncompletedCount++;
        }
    });
    all.textContent = todos.length;
    completed.textContent = completedCount;
    uncompleted.textContent = uncompletedCount;
}

function editLocalTodos(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const textarea = todo.firstChild;
    const id = textarea.id;
    const todoIndex = textarea.value;

    
    let checkbox = todo.parentElement.firstChild.classList.contains('checboxCompleted');
    let index = todos.findIndex(obj => obj.id == id);
    let status = todos[index].status;
    let date = todos[index].date

    if (checkbox) {
        status = 'completed';
    } else {
        status = 'uncompleted'
    }

    let data = {
        todo: todoIndex,
        status: status,
        id: id,
        date: date
    };

    todos.splice(index, 1, data);

    localStorage.setItem('todos', JSON.stringify(todos));
}

function removeLocalTodos(todo) {
    let todos;
    let all = filterOption.firstElementChild.lastChild;
    let completed = filterOption.children[1].lastChild;
    let uncompleted = filterOption.lastElementChild.lastChild;

    let completedCount = completed.textContent;
    let uncompletedCount = uncompleted.textContent;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex = todo.children[1].children[0].value;
    let index = todos.findIndex(obj => obj.todo == todoIndex);

    if(todos[index].status === 'completed') {
        completed.textContent = completedCount--;
    } else {
        uncompleted.textContent = uncompletedCount--;
    }

    todos.splice(index, 1);

    all.textContent = todos.length;
    completed.textContent = completedCount;
    uncompleted.textContent = uncompletedCount;

    localStorage.setItem('todos', JSON.stringify(todos));
}

function markCompleted(todo) {
    let todos;
    let completed = filterOption.children[1].lastChild;
    let uncompleted = filterOption.lastElementChild.lastChild;

    let completedCount = completed.textContent;
    let uncompletedCount = uncompleted.textContent;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex = todo.firstChild.value;
    let index = todos.findIndex(obj => obj.todo == todoIndex);

    if (todos[index].status === 'uncompleted') {
        todos[index].status = 'completed';
        completedCount++;
        uncompletedCount--;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    else {
        todos[index].status = "uncompleted";
        uncompletedCount++;
        completedCount--;
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    completed.textContent = completedCount;
    uncompleted.textContent = uncompletedCount;
    
}

function duplicateTodoCheck(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    for (let i = 0; i < todos.length; i++) {
        if (todos[i]['todo'] === todo) {
            return 'duplicate';
        }
    }
}