// Dark To-Do App: add/remove/complete/edit + localStorage persistence

const STORAGE_KEY = "todoList-v1";

// Elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskListEl = document.getElementById("taskList");
const emptyText = document.getElementById("emptyText");
const clearCompletedBtn = document.getElementById("clearCompleted");
const clearAllBtn = document.getElementById("clearAll");

// State
let tasks = loadTasks();

// Initialize UI
renderTasks();

// Load tasks
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("Failed to parse tasks from storage", e);
    return [];
  }
}

// Save tasks
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Create task object
function createTask(text) {
  return {
    id: Date.now().toString() + Math.random().toString(16).slice(2, 8),
    text: text.trim(),
    completed: false,
  };
}

// Render tasks
function renderTasks() {
  taskListEl.innerHTML = "";
  emptyText.style.display = tasks.length === 0 ? "block" : "none";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.setAttribute("data-id", task.id);

    // Left: checkbox + task text
    const leftDiv = document.createElement("div");
    leftDiv.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      `Mark "${task.text}" as ${task.completed ? "incomplete" : "complete"}`
    );

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    if (task.completed) span.classList.add("completed");

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    // Right: Edit + Delete text buttons
    const actions = document.createElement("div");
    actions.className = "item-actions";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "text-btn edit-btn";
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit your task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "text-btn delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      removeTask(task.id);
    });

    // Checkbox listener
    checkbox.addEventListener("change", () => {
      toggleComplete(task.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(actions);

    taskListEl.appendChild(li);
  });
}

// Add new task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push(createTask(text));
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
});

// Toggle completed
function toggleComplete(id) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return;
  tasks[idx].completed = !tasks[idx].completed;
  saveTasks();
  renderTasks();
}

// Remove task
function removeTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  const anyCompleted = tasks.some((t) => t.completed);
  if (!anyCompleted) return;
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
});

// Clear all
clearAllBtn.addEventListener("click", () => {
  if (!tasks.length) return;
  const okay = confirm("Clear all tasks? This cannot be undone.");
  if (!okay) return;
  tasks = [];
  saveTasks();
  renderTasks();
});

// Focus input on page load
window.addEventListener("load", () => {
  taskInput.focus();
});
