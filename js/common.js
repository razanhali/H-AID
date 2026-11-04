/* common.js - Logout function only. Auth guard is inline in each page's <head> */

function logout() {
    if (confirm("Are you sure you want to log out?")) {
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("staffName");
        window.location.href = "index.html";
    }
}
