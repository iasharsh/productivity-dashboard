const timeSlots = document.querySelectorAll(".time-slot");
let plans = JSON.parse(localStorage.getItem("plans")) || {};

function renderPlans() {
    timeSlots.forEach((slot, index) => {
        const key = `slot-${index}`;
        const p = slot.querySelector("p");
        if (plans[key]) {
            p.textContent = plans[key];
            slot.classList.add("filled");
        } else {
            p.textContent = "...";
            slot.classList.remove("filled");
        }

        slot.onclick = () => enableEditing(slot, index);
    });
}

function enableEditing(slot, index) {
    const key = `slot-${index}`;
    const p = slot.querySelector("p");
    if (slot.querySelector("input")) return;

    const input = document.createElement("input");
    input.type = "text";
    input.value = plans[key] || "";
    input.className = "slot-input";

    slot.replaceChild(input, p);
    input.focus();

    let alreadySaved = false; // guard: only allow ONE save per input

    function doSave() {
        if (alreadySaved) return;
        alreadySaved = true;
        savePlan(slot, index, input.value);
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            input.blur(); // let blur handle the save — don't call savePlan directly here
        }
    });

    input.addEventListener("blur", doSave);
}

function savePlan(slot, index, text) {
    const key = `slot-${index}`;
    plans[key] = text.trim();
    localStorage.setItem("plans", JSON.stringify(plans));

    const p = document.createElement("p");
    p.textContent = plans[key] || "...";
    slot.querySelector("input")?.replaceWith(p);

    if (plans[key]) {
        slot.classList.add("filled");
    } else {
        slot.classList.remove("filled");
    }
}

function highlightCurrentSlot() {
    const now = new Date();
    const currentHour = now.getHours();

    timeSlots.forEach(slot => {
        slot.classList.remove("active");
        const timeRange = slot.querySelector("h3").textContent;
        const [start, end] = timeRange.split("-").map(t => parseInt(t.split(":")[0]));

        const adjustEnd = end === 0 ? 24 : end;

        if (currentHour >= start && currentHour < adjustEnd) {
            slot.classList.add("active");
        }
    });
}


renderPlans();
highlightCurrentSlot();


setInterval(highlightCurrentSlot, 60000);
