const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
    window.location.href = "index.html";
}

// Populate beneficiary info
document.getElementById("welcomeText").textContent = "Welcome, " + user.name;
document.getElementById("fullName").textContent    = user.name;
document.getElementById("nationalId").textContent  = user.nationalId;
document.getElementById("family").textContent      = user.family + " members";
document.getElementById("priority").textContent    = user.priority;
document.getElementById("userStatus").textContent  = user.status;

// Optional fields (may not exist in simple beneficiary object)
document.getElementById("packageType").textContent  = user.packageName     || "Food + Hygiene Kit";
document.getElementById("pickupDate").textContent   = user.pickupDate      || "To be announced";
document.getElementById("queueNumber").textContent  = user.queueNumber     || user.id;
document.getElementById("location").textContent     = user.pickupLocation  || "To be announced";
document.getElementById("content").textContent      = user.packageContent  || "Food Package + Hygiene Kit";

function downloadData() {
    const details =
        "Full Name: "       + user.name                              + "\n" +
        "National ID: "     + user.nationalId                        + "\n" +
        "Beneficiary ID: "  + user.id                                + "\n" +
        "Family Members: "  + user.family                            + "\n" +
        "Priority: "        + user.priority                          + "\n" +
        "Status: "          + user.status                            + "\n" +
        "Aid Package: "     + (user.packageName    || "Food + Hygiene Kit") + "\n" +
        "Pickup Date: "     + (user.pickupDate     || "To be announced")    + "\n" +
        "Queue Number: "    + (user.queueNumber    || user.id)              + "\n" +
        "Pickup Location: " + (user.pickupLocation || "To be announced")    + "\n" +
        "Package Content: " + (user.packageContent || "Food Package + Hygiene Kit");

    const blob = new Blob([details], { type: "text/plain" });
    const link = document.createElement("a");
    link.href     = URL.createObjectURL(blob);
    link.download = "beneficiary-details.txt";
    link.click();
}

function logout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
    window.location.href = "index.html";
}