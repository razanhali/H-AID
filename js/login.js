let selectedRole = "";

// Seed demo beneficiaries on first visit so beneficiary login works immediately
(function () {
    if (!sessionStorage.getItem("beneficiaries")) {
        sessionStorage.setItem("beneficiaries", JSON.stringify([
            { id: "B-001", name: "Ahmed Ali",   nationalId: "401234567", family: 6, priority: "High",   status: "Active"   },
            { id: "B-002", name: "Ali Hassan",  nationalId: "402234567", family: 4, priority: "Low",    status: "Inactive" },
            { id: "B-003", name: "Sara Nasser", nationalId: "403234567", family: 3, priority: "Medium", status: "Pending"  }
        ]));
    }
})();

function selectRole(role) {
    selectedRole = role;
    document.getElementById("beneficiaryFields").style.display = "none";
    document.getElementById("staffFields").style.display = "none";
    document.getElementById("orSeparator").style.display = "block";
    document.getElementById("loginBtn").style.display = "block";

    if (role === "beneficiary") {
        document.getElementById("beneficiaryFields").style.display = "flex";
        document.getElementById("beneficiaryCard").classList.add("active");
        document.getElementById("staffCard").classList.remove("active");
    } else {
        document.getElementById("staffFields").style.display = "flex";
        document.getElementById("staffCard").classList.add("active");
        document.getElementById("beneficiaryCard").classList.remove("active");
    }
}

function login() {
    if (!selectedRole) {
        alert("Please choose your role first.");
        return;
    }

    if (selectedRole === "staff") {
        const name = document.getElementById("staffName").value.trim();
        const pass = document.getElementById("staffPassword").value.trim();

        if (!name || !pass) { alert("Please fill in all staff fields."); return; }

        if (name.toLowerCase() === "staff" && pass === "staff123") {
            sessionStorage.setItem("currentUser", JSON.stringify({ username: name, role: "Staff" }));
            sessionStorage.setItem("role", "staff");
            window.location.href = "dashboard.html";
            return;
        }
        alert("Invalid credentials.\nUsername: staff\nPassword: staff123");
        return;
    }

    if (selectedRole === "beneficiary") {
        const name = document.getElementById("beneficiaryName").value.trim();
        const nid  = document.getElementById("beneficiaryNationalId").value.trim();

        if (!name || !nid) { alert("Please enter Full Name and National ID."); return; }
        if (!/^\d{9}$/.test(nid)) { alert("National ID must be 9 digits."); return; }

        const list = JSON.parse(sessionStorage.getItem("beneficiaries")) || [];
        const found = list.find(b =>
            b.name.toLowerCase() === name.toLowerCase() && b.nationalId === nid
        );

        if (!found) {
            alert(
                "Beneficiary not found.\n\n" +
                "Demo accounts:\n" +
                "  Ahmed Ali     → 401234567\n" +
                "  Ali Hassan    → 402234567\n" +
                "  Sara Nasser   → 403234567"
            );
            return;
        }

        sessionStorage.setItem("role", "beneficiary");
        sessionStorage.setItem("user", JSON.stringify(found));
        window.location.href = "user.html";
    }
}
