let distributions = JSON.parse(sessionStorage.getItem("distributions")) || [];

function generateDistributionId() {
    const lastId = distributions.length > 0
        ? Math.max(...distributions.map(d => Number(d.id.split("-")[1])))
        : 0;
    return "D-" + String(lastId + 1).padStart(3, "0");
}

function loadBeneficiaries() {
    const select = document.getElementById("beneficiary");
    const list   = JSON.parse(sessionStorage.getItem("beneficiaries")) || [];
    select.innerHTML = `<option value="">Choose beneficiary</option>`;
    list.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b.name;
        opt.textContent = b.name + " (" + b.id + ")";
        select.appendChild(opt);
    });
}

function renderDistributions(data = distributions) {
    const tbody = document.getElementById("table-body");
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:30px;">No distributions found</td></tr>`;
        updateCards();
        return;
    }
    tbody.innerHTML = data.map(d => {
        const badgeClass = d.status === "Completed" ? "badge-completed" : "badge-pending";
        return `
        <tr>
            <td><strong>${d.id}</strong></td>
            <td>${d.beneficiary}</td>
            <td>${d.resource}</td>
            <td>${d.quantity}</td>
            <td>${d.date}</td>
            <td><span class="badge ${badgeClass}">${d.status}</span></td>
            <td>
                <button class="btn-danger" onclick="deleteDistribution('${d.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    }).join("");
    updateCards();
}

function addDistribution() {
    const beneficiary = document.getElementById("beneficiary").value;
    const resource    = document.getElementById("resource").value;
    const quantity    = Number(document.getElementById("quantity").value);
    const date        = document.getElementById("date").value;

    if (!beneficiary || !resource || quantity <= 0 || !date) {
        alert("Please fill in all fields correctly."); return;
    }

    distributions.push({
        id: generateDistributionId(),
        beneficiary,
        resource,
        quantity,
        date,
        status: "Completed"
    });

    sessionStorage.setItem("distributions", JSON.stringify(distributions));
    renderDistributions();
    clearForm();
    alert("Distribution added successfully!");
}

function deleteDistribution(id) {
    if (!confirm("Are you sure you want to delete this distribution?")) return;
    distributions = distributions.filter(d => d.id !== id);
    sessionStorage.setItem("distributions", JSON.stringify(distributions));
    renderDistributions();
}

function searchDistribution() {
    const q = document.getElementById("search").value.toLowerCase();
    renderDistributions(distributions.filter(d =>
        d.id.toLowerCase().includes(q) ||
        d.beneficiary.toLowerCase().includes(q) ||
        d.resource.toLowerCase().includes(q) ||
        d.date.includes(q) ||
        d.status.toLowerCase().includes(q)
    ));
}

function updateCards() {
    document.getElementById("totalDistributions").textContent = distributions.length;
    document.getElementById("completed").textContent  = distributions.filter(d => d.status === "Completed").length;
    document.getElementById("pending").textContent    = distributions.filter(d => d.status === "Pending").length;
    document.getElementById("beneficiaries").textContent = new Set(distributions.map(d => d.beneficiary)).size;
}

function clearForm() {
    document.getElementById("beneficiary").value = "";
    document.getElementById("resource").value    = "";
    document.getElementById("quantity").value    = "";
    document.getElementById("date").value        = "";
}

window.onload = function () {
    loadBeneficiaries();
    renderDistributions();
};