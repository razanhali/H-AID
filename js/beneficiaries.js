let currentEditId = null;
let beneficiaries = JSON.parse(sessionStorage.getItem("beneficiaries")) || [
    { id: "B-001", name: "Ahmed Ali",  nationalId: "401234567", family: 6, priority: "High",   status: "Active"   },
    { id: "B-002", name: "Ali Hassan", nationalId: "402234567", family: 4, priority: "Low",    status: "Inactive" },
    { id: "B-003", name: "Sara Nasser",nationalId: "403234567", family: 3, priority: "Medium", status: "Pending"  }
];

function generateId() {
    const lastId = beneficiaries.length > 0
        ? Math.max(...beneficiaries.map(b => Number(b.id.split("-")[1])))
        : 0;
    return "B-" + String(lastId + 1).padStart(3, "0");
}

function priorityBadge(p) {
    const map = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
    return `<span class="badge ${map[p] || ''}">${p}</span>`;
}

function statusBadge(s) {
    const map = { Active: "badge-active", Pending: "badge-pending", Inactive: "badge-inactive" };
    return `<span class="badge ${map[s] || ''}">${s}</span>`;
}

function renderTable(data = beneficiaries) {
    const tbody = document.getElementById("table-body");
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:30px;">No beneficiaries found</td></tr>`;
        updateCards();
        return;
    }
    tbody.innerHTML = data.map(b => `
        <tr>
            <td><strong>${b.id}</strong></td>
            <td>${b.name}</td>
            <td>${b.nationalId}</td>
            <td>${b.family}</td>
            <td>${priorityBadge(b.priority)}</td>
            <td>${statusBadge(b.status)}</td>
            <td>
                <button class="btn-edit" onclick="editBeneficiary('${b.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-danger" onclick="deleteBeneficiary('${b.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`).join("");
    updateCards();
}

function updateCards() {
    document.getElementById("total").textContent   = beneficiaries.length;
    document.getElementById("active").textContent  = beneficiaries.filter(b => b.status === "Active").length;
    document.getElementById("high").textContent    = beneficiaries.filter(b => b.priority === "High").length;
    document.getElementById("pending").textContent = beneficiaries.filter(b => b.status === "Pending").length;
}

function addBeneficiary() {
    const name     = document.getElementById("name").value.trim();
    const nid      = document.getElementById("nid").value.trim();
    const family   = Number(document.getElementById("family").value);
    const priority = document.getElementById("priority").value;
    const status   = document.getElementById("status").value;

    if (!name || !nid || family <= 0 || !priority || !status) {
        alert("Please fill in all required fields."); return;
    }
    if (nid.length !== 9) {
        alert("National ID must be 9 digits."); return;
    }
    if (beneficiaries.some(b => b.nationalId === nid && b.id !== currentEditId)) {
        alert("National ID already exists."); return;
    }

    if (currentEditId) {
        const idx = beneficiaries.findIndex(b => b.id === currentEditId);
        if (idx !== -1) beneficiaries[idx] = { ...beneficiaries[idx], name, nationalId: nid, family, priority, status };
        currentEditId = null;
    } else {
        beneficiaries.push({ id: generateId(), name, nationalId: nid, family, priority, status });
    }

    sessionStorage.setItem("beneficiaries", JSON.stringify(beneficiaries));
    renderTable();
    closeModal();
    alert("Beneficiary saved successfully!");
}

function editBeneficiary(id) {
    const b = beneficiaries.find(b => b.id === id);
    if (!b) return;
    currentEditId = id;
    document.getElementById("name").value     = b.name;
    document.getElementById("nid").value      = b.nationalId;
    document.getElementById("family").value   = b.family;
    document.getElementById("priority").value = b.priority;
    document.getElementById("status").value   = b.status;
    document.getElementById("modal-title").textContent = "Edit Beneficiary";
    openModal();
}

function deleteBeneficiary(id) {
    if (!confirm("Are you sure you want to delete this beneficiary?")) return;
    beneficiaries = beneficiaries.filter(b => b.id !== id);
    sessionStorage.setItem("beneficiaries", JSON.stringify(beneficiaries));
    renderTable();
}

function searchBeneficiary() {
    const q = document.getElementById("search").value.toLowerCase();
    renderTable(beneficiaries.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.nationalId.includes(q) ||
        b.status.toLowerCase().includes(q) ||
        b.priority.toLowerCase().includes(q)
    ));
}

function openModal() {
    document.getElementById("modal").classList.add("open");
}

function closeModal() {
    document.getElementById("modal").classList.remove("open");
    document.getElementById("name").value     = "";
    document.getElementById("nid").value      = "";
    document.getElementById("family").value   = "";
    document.getElementById("priority").value = "";
    document.getElementById("status").value   = "";
    document.getElementById("modal-title").textContent = "Add Beneficiary";
    currentEditId = null;
}

window.onload = function () {
    // Persist defaults to sessionStorage if not already saved
    if (!sessionStorage.getItem("beneficiaries")) {
        sessionStorage.setItem("beneficiaries", JSON.stringify(beneficiaries));
    }
    renderTable();
};