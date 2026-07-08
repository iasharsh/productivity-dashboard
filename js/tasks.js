const taskTitle = document.getElementById("task-title");
const taskDesc = document.getElementById("task-desc");
const importantCheckbox = document.getElementById("important");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const cancelEditBtn = document.getElementById("cancel-edit");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        if (task.important) taskItem.classList.add('important');

        taskItem.innerHTML = `
        <div>
            <h3>${task.title}</h3>
            <p>${task.desc}</p>
        </div>
        <div class="task-actions">
            <i class="fa-solid ${task.done ? "fa-rotate-left" : "fa-check"}" onclick="toggleDone(${index})"></i>
            <i class="fa-solid fa-pen" onclick="editTask(${index})"></i>
            <i class="fa-solid fa-trash" onclick="deleteTask(${index})"></i>
        </div>
        `;


        if (task.done) taskItem.classList.add("done");
        taskList.appendChild(taskItem);
    });
}

function addTask() {
    const title = taskTitle.value.trim();
    const desc = taskDesc.value.trim();
    const important = importantCheckbox.checked;

    if (title === "") {
        alert("Please enter a task title.");
        return;
    }

    const duplicate = tasks.some((task, index) =>
        index !== editIndex &&
        task.title.toLowerCase() === title.toLowerCase() &&
        task.desc.toLowerCase() === desc.toLowerCase()
    );

    if (duplicate) {
        alert("This task already exists!");
        return;
    }

    if (editIndex !== null) {
        tasks[editIndex] = { title, desc, important, done: tasks[editIndex].done };
        editIndex = null;
        addTaskBtn.textContent = "Add Task";
        cancelEditBtn.style.display = "none";
    } else {
        tasks.push({ title, desc, important, done: false });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();

    taskTitle.value = "";
    taskDesc.value = "";
    importantCheckbox.checked = false;
}

function editTask(index) {
    const task = tasks[index];
    taskTitle.value = task.title;
    taskDesc.value = task.desc;
    importantCheckbox.checked = task.important;
    editIndex = index;
    addTaskBtn.textContent = " Update Task";
    cancelEditBtn.style.display = "inline-block";
}

function cancelEdit() {
    editIndex = null;
    addTaskBtn.textContent = "Add Task";
    cancelEditBtn.style.display = "none";

    taskTitle.value = "";
    taskDesc.value = "";
    importantCheckbox.checked = false;
}

function toggleDone(index) {
    tasks[index].done = !tasks[index].done;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();

    taskTitle.value = "";
    taskDesc.value = "";
    importantCheckbox.checked = false;
    cancelEditBtn.style.display = "none";
    addTaskBtn.textContent = "Add Task";
}

addTaskBtn.addEventListener("click", addTask);
cancelEditBtn.addEventListener("click", cancelEdit);

renderTasks();