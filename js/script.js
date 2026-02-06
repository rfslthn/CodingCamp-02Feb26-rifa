// js/script.js

let todos = [];

const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const tableBody = document.getElementById("todoTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const filterInput = document.getElementById("filterInput");

// Fungsi Tambah Todo
function addTodo() {
    const taskValue = taskInput.value.trim();
    const dateValue = dateInput.value;

    if (taskValue === "" || dateValue === "") {
        alert("Please fill in both the task and the due date!");
        return;
    }

    const newTodo = {
        id: Date.now(),
        task: taskValue,
        date: dateValue,
        completed: false
    };

    todos.push(newTodo);
    saveData(); // (Opsional) Simpan ke LocalStorage agar tidak hilang saat refresh
    renderTodos();
    
    taskInput.value = "";
    dateInput.value = "";
}

// Fungsi Render
function renderTodos() {
    tableBody.innerHTML = "";
    
    const filterValue = filterInput.value;

    let filteredTodos = todos;
    if (filterValue === "completed") {
        filteredTodos = todos.filter(todo => todo.completed === true);
    } else if (filterValue === "pending") {
        filteredTodos = todos.filter(todo => todo.completed === false);
    }

    if (filteredTodos.length === 0) {
        emptyMessage.classList.remove("hidden"); // Tampilkan pesan kosong (Tailwind class)
    } else {
        emptyMessage.classList.add("hidden"); // Sembunyikan pesan kosong
    }

    filteredTodos.forEach(todo => {
        const row = document.createElement("tr");
        row.className = "border-b border-gray-700 last:border-none"; // Styling baris tabel

        // Kolom Task
        const taskCell = document.createElement("td");
        taskCell.className = `p-4 ${todo.completed ? "line-through text-gray-500" : "text-white"}`;
        taskCell.textContent = todo.task;
        row.appendChild(taskCell);

        // Kolom Date
        const dateCell = document.createElement("td");
        dateCell.className = `p-4 ${todo.completed ? "text-gray-500" : "text-gray-300"}`;
        dateCell.textContent = todo.date;
        row.appendChild(dateCell);

        // Kolom Status (Badge)
        const statusCell = document.createElement("td");
        statusCell.className = "p-4";
        const statusBadge = document.createElement("span");
        
        if (todo.completed) {
            statusBadge.textContent = "Completed";
            statusBadge.className = "bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded";
        } else {
            statusBadge.textContent = "Pending";
            statusBadge.className = "bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded";
        }
        
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Kolom Actions
        const actionCell = document.createElement("td");
        actionCell.className = "p-4 flex gap-2";
        
        // Tombol Checklist (Selesai)
        const checkBtn = document.createElement("button");
        checkBtn.innerHTML = "✓";
        checkBtn.className = "bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded shadow transition flex items-center justify-center";
        checkBtn.onclick = () => toggleStatus(todo.id);
        
        // Tombol Hapus (Delete)
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "✕"; // Menggunakan simbol X
        deleteBtn.className = "bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded shadow transition flex items-center justify-center";
        deleteBtn.onclick = () => deleteTodo(todo.id);

        actionCell.appendChild(checkBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

function toggleStatus(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        todos[index].completed = !todos[index].completed;
        saveData();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveData();
    renderTodos();
}

function deleteAll() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        todos = [];
        saveData();
        renderTodos();
    }
}

function filterTodos() {
    renderTodos();
}

// Tambahan: Local Storage agar data tidak hilang saat refresh
function saveData() {
    localStorage.setItem("myTodos", JSON.stringify(todos));
}

function loadData() {
    const data = localStorage.getItem("myTodos");
    if (data) {
        todos = JSON.parse(data);
        renderTodos();
    }
}

// Load data saat halaman dibuka
loadData();