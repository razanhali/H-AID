// Dashboard - load live counts from sessionStorage
window.onload = function () {
    const resources      = JSON.parse(sessionStorage.getItem("resources"))      || [];
    const beneficiaries  = JSON.parse(sessionStorage.getItem("beneficiaries"))  || [];
    const distributions  = JSON.parse(sessionStorage.getItem("distributions"))  || [];

    document.getElementById("totalResources").textContent     = resources.length;
    document.getElementById("totalBeneficiaries").textContent = beneficiaries.length;
    document.getElementById("totalDistributions").textContent = distributions.length;
    document.getElementById("pendingDistributions").textContent =
        distributions.filter(d => d.status === "Pending").length;
};