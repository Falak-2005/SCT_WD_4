// Select DOM elements
const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskTime = document.getElementById('task-time');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let tasks = [];
let editTaskId = null;

// Load tasks from localStorage on page load
window.onload = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
};

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks to the DOM
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        li.dataset.id = task.id;

        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';

        const taskText = document.createElement('div');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        const taskDateTime = document.createElement('div');
        taskDateTime.className = 'task-datetime';
        if (task.date || task.time) {
            taskDateTime.textContent = `${task.date ? task.date : ''} ${task.time ? task.time : ''}`.trim();
        }

        taskInfo.appendChild(taskText);
        taskInfo.appendChild(taskDateTime);

        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = task.completed ? '↺' : '✔';
        completeBtn.title = task.completed ? 'Mark as Incomplete' : 'Mark as Complete';
        completeBtn.addEventListener('click', () => toggleComplete(task.id));

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✎';
        editBtn.title = 'Edit Task';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => startEditTask(task.id));

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑';
        deleteBtn.title = 'Delete Task';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskActions.appendChild(completeBtn);
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);

        li.appendChild(taskInfo);
        li.appendChild(taskActions);

        taskList.appendChild(li);
    });
}

// Add or update task
function addOrUpdateTask() {
    const text = taskInput.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;

    if (!text) {
        alert('Please enter a task.');
        return;
    }

    if (editTaskId) {
        // Update existing task
        const task = tasks.find(t => t.id === editTaskId);
        if (task) {
            task.text = text;
            task.date = date;
            task.time = time;
        }
        editTaskId = null;
        addTaskBtn.textContent = 'Add Task';
    } else {
        // Add new task
        const newTask = {
            id: Date.now().toString(),
            text,
            date,
            time,
            completed: false
        };
        tasks.push(newTask);
    }

    taskInput.value = '';
    taskDate.value = '';
    taskTime.value = '';
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Start editing a task
function startEditTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        taskInput.value = task.text;
        taskDate.value = task.date;
        taskTime.value = task.time;
        editTaskId = id;
        addTaskBtn.textContent = 'Update Task';
    }
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Event listener for add/update button
addTaskBtn.addEventListener('click', addOrUpdateTask);

// Optional: Allow pressing Enter key to add/update task
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addOrUpdateTask();
    }
});
