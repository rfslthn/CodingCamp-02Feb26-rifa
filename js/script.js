let todos = [];

const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const tableBody = document.getElementById("todoTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const filterInput = document.getElementById("filterInput");

// --- LOGIKA UTAMA ---

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
    saveData();
    renderTodos();
    
    taskInput.value = "";
    dateInput.value = "";
}

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
        emptyMessage.classList.remove("hidden");
    } else {
        emptyMessage.classList.add("hidden");
    }

    filteredTodos.forEach(todo => {
        const row = document.createElement("tr");
        // Style Baris: Menyesuaikan border untuk light/dark mode
        row.className = "border-b border-gray-200 dark:border-gray-700 last:border-none transition-colors";

        // Kolom Task
        const taskCell = document.createElement("td");
        // Style Text: Hitam di light mode, Putih di dark mode (kecuali dicoret)
        const textStyle = todo.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-white";
        taskCell.className = `p-4 ${textStyle}`;
        taskCell.textContent = todo.task;
        row.appendChild(taskCell);

        // Kolom Date
        const dateCell = document.createElement("td");
        dateCell.className = `p-4 ${todo.completed ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-300"}`;
        dateCell.textContent = todo.date;
        row.appendChild(dateCell);

        // Kolom Status
        const statusCell = document.createElement("td");
        statusCell.className = "p-4";
        const statusBadge = document.createElement("span");
        
        if (todo.completed) {
            statusBadge.textContent = "Completed";
            statusBadge.className = "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold px-2 py-1 rounded";
        } else {
            statusBadge.textContent = "Pending";
            statusBadge.className = "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold px-2 py-1 rounded";
        }
        
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Kolom Actions
        const actionCell = document.createElement("td");
        actionCell.className = "p-4 flex gap-2";
        
        const checkBtn = document.createElement("button");
        checkBtn.innerHTML = "✓";
        checkBtn.className = "bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded shadow transition flex items-center justify-center";
        checkBtn.onclick = () => toggleStatus(todo.id);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "✕";
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

// --- LOCAL STORAGE & DATA LOADING ---

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

// --- FITUR DARK MODE ---

// Cek preferensi user saat pertama kali load
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");

// Fungsi cek tema awal
function loadTheme() {
    // Cek apakah ada simpanan di local storage atau cek preferensi sistem OS
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        showSunIcon();
    } else {
        document.documentElement.classList.remove('dark');
        showMoonIcon();
    }
}

// Fungsi Toggle (Dihubungkan ke tombol)
function toggleTheme() {
    const html = document.documentElement;
    
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.theme = 'light'; // Simpan pilihan user
        showMoonIcon();
    } else {
        html.classList.add('dark');
        localStorage.theme = 'dark'; // Simpan pilihan user
        showSunIcon();
    }
}

function showSunIcon() {
    iconSun.classList.remove("hidden");
    iconMoon.classList.add("hidden");
}

function showMoonIcon() {
    iconMoon.classList.remove("hidden");
    iconSun.classList.add("hidden");
}

// Jalankan saat website dibuka
loadTheme();
loadData();