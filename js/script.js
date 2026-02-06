// Array untuk menyimpan data todo
let todos = [];

// Selektor elemen DOM
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const tableBody = document.getElementById("todoTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const filterInput = document.getElementById("filterInput");

// Fungsi 1: Menambahkan Todo (Create)
function addTodo() {
    const taskValue = taskInput.value;
    const dateValue = dateInput.value;

    // Validasi Input: Tidak boleh kosong
    if (taskValue === "" || dateValue === "") {
        alert("Please fill in both the task and the due date!");
        return;
    }

    // Membuat objek todo baru
    const newTodo = {
        id: Date.now(), // ID unik menggunakan timestamp
        task: taskValue,
        date: dateValue,
        completed: false // Default status: Pending
    };

    // Masukkan ke array dan render ulang
    todos.push(newTodo);
    renderTodos();
    
    // Reset form input
    taskInput.value = "";
    dateInput.value = "";
}

// Fungsi 2: Menampilkan/Render Todo ke Tabel
function renderTodos() {
    tableBody.innerHTML = ""; // Bersihkan tabel sebelum render ulang
    
    // Cek Filter yang dipilih
    const filterValue = filterInput.value;

    // Filter array berdasarkan status
    let filteredTodos = todos;
    if (filterValue === "completed") {
        filteredTodos = todos.filter(todo => todo.completed === true);
    } else if (filterValue === "pending") {
        filteredTodos = todos.filter(todo => todo.completed === false);
    }

    // Tampilkan pesan "No task found" jika kosong
    if (filteredTodos.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    // Loop data dan buat elemen HTML baris per baris
    filteredTodos.forEach(todo => {
        const row = document.createElement("tr");

        // Kolom Task (Nama Tugas)
        const taskCell = document.createElement("td");
        taskCell.textContent = todo.task;
        if (todo.completed) taskCell.classList.add("task-completed");
        row.appendChild(taskCell);

        // Kolom Due Date (Tanggal)
        const dateCell = document.createElement("td");
        dateCell.textContent = todo.date;
        row.appendChild(dateCell);

        // Kolom Status
        const statusCell = document.createElement("td");
        statusCell.textContent = todo.completed ? "Completed" : "Pending";
        statusCell.className = todo.completed ? "status-completed" : "status-pending";
        row.appendChild(statusCell);

        // Kolom Actions (Tombol Selesai & Hapus)
        const actionCell = document.createElement("td");
        
        // Tombol Checklist (Toggle Status)
        const checkBtn = document.createElement("button");
        checkBtn.textContent = "✓";
        checkBtn.className = "action-btn btn-complete";
        checkBtn.onclick = () => toggleStatus(todo.id);
        
        // Tombol Hapus (Delete per item)
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.className = "action-btn btn-delete";
        deleteBtn.onclick = () => deleteTodo(todo.id);

        actionCell.appendChild(checkBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        // Masukkan baris ke tabel body
        tableBody.appendChild(row);
    });
}

// Fungsi 3: Mengubah Status (Pending <-> Completed)
function toggleStatus(id) {
    // Cari index todo berdasarkan ID
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        todos[index].completed = !todos[index].completed; // Toggle true/false
        renderTodos(); // Render ulang tampilan
    }
}

// Fungsi 4: Menghapus Satu Todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

// Fungsi 5: Menghapus SEMUA Todo
function deleteAll() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        todos = [];
        renderTodos();
    }
}

// Fungsi 6: Handle Filter Change
function filterTodos() {
    renderTodos();
}