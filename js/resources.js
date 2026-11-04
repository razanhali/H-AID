let data = JSON.parse(sessionStorage.getItem("resources")) || [];
let currentEditId = null;

function generateId() {
    const lastId = data.length > 0
        ? Math.max(...data.map(r => Number(r.id.split("-")[1])))
        : 0;
    return "R-" + String(lastId + 1).padStart(4, "0");
}

function statusBadge(qty) {
    return Number(qty) > 100
        ? `<span class="badge badge-available">Available</span>`
        : `<span class="badge badge-low-stock">Low Stock</span>`;
}

function render(list = data) {
    const tbody = document.getElementById("tableBody");
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:30px;">No resources found</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(d => `
        <tr>
            <td><strong>${d.id}</strong></td>
            <td>${d.name}</td>
            <td>${d.cat}</td>
            <td>${d.qty}</td>
            <td>${d.unit}</td>
            <td>${statusBadge(d.qty)}</td>
            <td>
                <button class="btn-edit" onclick="editResource('${d.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-danger" onclick="deleteItem('${d.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`).join("");
}

function addResource() {
    const name = document.getElementById("name").value.trim();
    const qty  = Number(document.getElementById("qty").value);
    const cat  = document.getElementById("cat").value;
    const unit = document.getElementById("unit").value;

    if (!name || !cat || qty <= 0 || !unit) {
        alert("Please fill all fields correctly."); return;
    }

    if (currentEditId) {
        const idx = data.findIndex(r => r.id === currentEditId);
        data[idx] = { id: currentEditId, name, cat, qty, unit };
        currentEditId = null;
    } else {
        data.push({ id: generateId(), name, cat, qty, unit });
    }

    sessionStorage.setItem("resources", JSON.stringify(data));
    render();
    closeModal();
}

function editResource(id) {
    const item = data.find(r => r.id === id);
    if (!item) return;
    currentEditId = id;
    document.getElementById("name").value  = item.name;
    document.getElementById("qty").value   = item.qty;
    document.getElementById("cat").value   = item.cat;
    document.getElementById("unit").value  = item.unit;
    document.getElementById("modal-title").textContent = "Edit Resource";
    document.getElementById("saveBtn").textContent = "Update Resource";
    openModal();
}

function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    data = data.filter(r => r.id !== id);
    sessionStorage.setItem("resources", JSON.stringify(data));
    render();
}

function openModal() {
    document.getElementById("modal").classList.add("open");
}

function closeModal() {
    document.getElementById("modal").classList.remove("open");
    document.getElementById("name").value  = "";
    document.getElementById("qty").value   = "";
    document.getElementById("cat").value   = "";
    document.getElementById("unit").value  = "";
    document.getElementById("modal-title").textContent = "Add Resource";
    document.getElementById("saveBtn").textContent = "Save Resource";
    currentEditId = null;
}

document.getElementById("search").addEventListener("keyup", function () {
    const q = this.value.toLowerCase();
    render(data.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.cat.toLowerCase().includes(q) ||
        r.unit.toLowerCase().includes(q)
    ));
});

render();