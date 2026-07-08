const goalTitle = document.getElementById("goal-title");
const goalDesc = document.getElementById("goal-desc");
const importantCheckbox = document.getElementById("important");
const addGoalBtn = document.getElementById("add-goal");
const goalList = document.getElementById("goal-list");
const cancelEditBtn = document.getElementById("cancel-edit");

let goals = JSON.parse(localStorage.getItem("goals")) || [];
let editIndex = null;

function showDate() {
    const today = new Date();
    const day = today.toLocaleDateString("en-US", { weekday: "long" });
    const date = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const dateHeader = document.getElementById("date-header");
    dateHeader.innerHTML = `
    <div class="day">${day}</div>
    <div class="date">${date}</div>
    <hr>`;
}

function renderGoals() {
    // goalList.innerHTML = document.getElementById("date-header").outerHTML;
    goalList.innerHTML = "";

    goals.forEach((goal, index) => {
        const goalItem = document.createElement("div");
        goalItem.className = "goal-item";
        if (goal.important) goalItem.classList.add('important');

        goalItem.innerHTML = `
        <div>
            <h3>${goal.title}</h3>
            <p>${goal.desc}</p>
        </div>
        <div class="goal-actions">
            <i class="fa-solid ${goal.done ? "fa-rotate-left" : "fa-check"}" onclick="toggleDone(${index})"></i>
            <i class="fa-solid fa-pen" onclick="editGoal(${index})"></i>
            <i class="fa-solid fa-trash" onclick="deleteGoal(${index})"></i>
        </div>
        `;

        if (goal.done) goalItem.classList.add("done");
        goalList.appendChild(goalItem);
    })

}



function addGoal() {
    const title = goalTitle.value.trim();
    const desc = goalDesc.value.trim();
    const important = importantCheckbox.checked;

    if (title === "") {
        alert("Please enter a goal title.");
        return;
    }

    const duplicate = goals.some((goal, index) =>
        index !== editIndex &&
        goal.title.toLowerCase() === title.toLowerCase() &&
        goal.desc.toLowerCase() === desc.toLowerCase()
    )

    if (duplicate) {
        alert("This goal already exists!");
        return;
    }

    if (editIndex !== null) {
        goals[editIndex] = { title, desc, important, done: goals[editIndex].done };
        editIndex = null;
        addGoalBtn.textContent = "Add Goal";
        cancelEditBtn.style.display = "none";
    } else {
        goals.push({ title, desc, important, done: false });
    }

    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();

    goalTitle.value = "";
    goalDesc.value = "";
    importantCheckbox.checked = false;
}

function cancelEdit() {
    editIndex = null;
    addGoalBtn.textContent = "Add Goal";
    cancelEditBtn.style.display = "none";

    goalTitle.value = "";
    goalDesc.value = "";
    importantCheckbox.checked = false;
}

function editGoal(index) {
    const goal = goals[index];
    goalTitle.value = goal.title;
    goalDesc.value = goal.desc;
    importantCheckbox.checked = goal.important;
    editIndex = index;
    addGoalBtn.textContent = "Update Goal";
    cancelEditBtn.style.display = "inline-block";
}

function toggleDone(index) {
    goals[index].done = !goals[index].done;
    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();
}

function deleteGoal(index) {
    goals.splice(index, 1);
    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();

    goalTitle.value = "";
    goalDesc.value = "";
    importantCheckbox.checked = false;
    cancelEditBtn.style.display = "none";
    addGoalBtn.textContent = "Add Task";
}

addGoalBtn.addEventListener("click", addGoal);
cancelEditBtn.addEventListener("click", cancelEdit);

showDate();
renderGoals();
