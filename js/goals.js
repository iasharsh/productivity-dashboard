const goalTitle = document.getElementById("goal-title");
const goalDesc = document.getElementById("goal-desc");
const goalImportant = document.getElementById("goal-important");
const addGoalBtn = document.getElementById("add-goal");
const goalList = document.getElementById("goal-list");
const goalCancelEditBtn = document.getElementById("goal-cancel-edit");

let goals = JSON.parse(localStorage.getItem("goals")) || [];
let goalEditIndex = null;

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
    });
}

function addGoal() {
    const title = goalTitle.value.trim();
    const desc = goalDesc.value.trim();
    const important = goalImportant.checked;

    if (title === "") {
        alert("Please enter a goal title.");
        return;
    }

    const duplicate = goals.some((goal, index) =>
        index !== goalEditIndex &&
        goal.title.toLowerCase() === title.toLowerCase() &&
        goal.desc.toLowerCase() === desc.toLowerCase()
    );

    if (duplicate) {
        alert("This goal already exists!");
        return;
    }

    if (goalEditIndex !== null) {
        goals[goalEditIndex] = { title, desc, important, done: goals[goalEditIndex].done };
        goalEditIndex = null;
        addGoalBtn.textContent = "Add Goal";
        goalCancelEditBtn.style.display = "none";
    } else {
        goals.push({ title, desc, important, done: false });
    }

    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();

    goalTitle.value = "";
    goalDesc.value = "";
    goalImportant.checked = false;
}

function cancelEdit() {
    goalEditIndex = null;
    addGoalBtn.textContent = "Add Goal";
    goalCancelEditBtn.style.display = "none";

    goalTitle.value = "";
    goalDesc.value = "";
    goalImportant.checked = false;
}

function editGoal(index) {
    const goal = goals[index];
    goalTitle.value = goal.title;
    goalDesc.value = goal.desc;
    goalImportant.checked = goal.important;
    goalEditIndex = index;
    addGoalBtn.textContent = "Update Goal";
    goalCancelEditBtn.style.display = "inline-block";
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
    goalImportant.checked = false;
    goalCancelEditBtn.style.display = "none";
    addGoalBtn.textContent = "Add Goal";
}

addGoalBtn.addEventListener("click", addGoal);
goalCancelEditBtn.addEventListener("click", cancelEdit);

showDate();
renderGoals();