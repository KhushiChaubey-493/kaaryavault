const modal = document.querySelector(".modal");
let titleInp = document.querySelector("#titleInp");
let descInp = document.querySelector("#descInp");
let addBtn = document.querySelector("#add");
let main = document.querySelector("main");
let form = document.querySelector("form");
const addNewTaskBtn = document.querySelector("#addNewTaskBtn");
let sections = document.querySelectorAll("section");

let draggedTaskId = null;
let activeTimer;

let tasks = JSON.parse(localStorage.getItem("tasksData")) || [];

addNewTaskBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let newTask = {
    id: Date.now(),
    title: e.target[0].value,
    description: e.target[1].value,
    status: "todo",
  };

  tasks.push(newTask);

  localStorage.setItem("tasksData", JSON.stringify(tasks));

  modal.style.display = "none";
  renderTasks();
  form.reset();
});

function renderTasks() {
  sections.forEach((section) => {
    section.querySelectorAll(".task").forEach((t) => {
      t.remove();
    });
  });

  let dataString = localStorage.getItem("tasksData");

  let myTasks = dataString ? JSON.parse(dataString) : [];

  myTasks.forEach((myTask) => {
    let div = document.createElement("div");
    div.classList.add("task");
    div.draggable = true;

    div.addEventListener("dragstart", () => {
      draggedTaskId = myTask.id;
    });

    let divInside = document.createElement("div");
    divInside.classList.add("task-left");
    let h4 = document.createElement("h4");
    h4.textContent = `${myTask.title}`;
    let p = document.createElement("p");
    p.textContent = `${myTask.description}`;

    divInside.appendChild(h4);
    divInside.appendChild(p);

    let button = document.createElement("button");
    button.classList.add("delete");
    button.textContent = "Delete";

    button.addEventListener("click", () => {
      div.classList.add("deleting");

      div.addEventListener(
        "animationend",
        () => {
          tasks = tasks.filter((t) => t.id !== myTask.id);

          localStorage.setItem("tasksData", JSON.stringify(tasks));

          renderTasks();
        },
        { once: true },
      );
    });

    div.appendChild(divInside);
    div.appendChild(button);

    if (myTask.status === "progress") {
      document.querySelector("#progress").appendChild(div);
    } else if (myTask.status === "done") {
      document.querySelector("#done").appendChild(div);
    } else {
      document.querySelector("#todo").appendChild(div);
    }
  });

  sections.forEach((section) => {
    let count = section.querySelectorAll(".task").length;
    let countEle = section.querySelector(".count");

    countEle.textContent = count;
  });
}

sections.forEach((section) => {
  section.addEventListener("dragover", (e) => {
    e.preventDefault();

    section.classList.add("active");

    clearTimeout(activeTimer);

    activeTimer = setTimeout(() => {
      section.classList.remove("active");
    }, 3000);
  });

  section.addEventListener("dragleave", () => {
    section.classList.remove("active");
  });

  section.addEventListener("drop", () => {
    let targetStatus = section.id;

    tasks = tasks.map((task) => {
      if (task.id === draggedTaskId) {
        return {
          ...task,
          status: targetStatus,
        };
      }

      return task;
    });

    localStorage.setItem("tasksData", JSON.stringify(tasks));

    draggedTaskId = null;
    renderTasks();
  });
});

renderTasks();
