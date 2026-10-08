const API_URL = "http://localhost:3000";

function getStudent() {
    return JSON.parse(localStorage.getItem("currentStudent"));
}

function getAdmin() {
    return JSON.parse(localStorage.getItem("currentAdmin"));
}

function logout() {

    localStorage.removeItem("currentStudent");
    localStorage.removeItem("currentAdmin");

    window.location.href = "index.html";
}

async function loginStudent(email, password) {

    const response = await fetch(
        API_URL + "/api/student/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );

    return await response.json();
}

async function loginAdmin(email, password) {

    const response = await fetch(
        API_URL + "/api/admin/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );

    return await response.json();
}

async function registerStudent(
    name,
    email,
    password,
    phone,
    department
) {

    const response = await fetch(
        API_URL + "/api/student/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                phone: phone,
                department: department
            })
        }
    );

    return await response.json();
}

async function registerAdmin(
    name,
    email,
    password,
    phone,
    department
) {

    const response = await fetch(
        API_URL + "/api/admin/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                phone: phone,
                department: department
            })
        }
    );

    return await response.json();
}

async function submitReport(reportData) {

    const response = await fetch(
        API_URL + "/api/reports",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reportData)
        }
    );

    return await response.json();
}

async function getStudentReports(email) {

    const response = await fetch(
        API_URL +
        "/api/reports/student/" +
        encodeURIComponent(email)
    );

    return await response.json();
}

async function getAllReports() {

    const response = await fetch(
        API_URL + "/api/reports"
    );

    return await response.json();
}

async function updateReportStatus(
    caseId,
    status,
    remarks
) {

    const response = await fetch(
        API_URL +
        "/api/reports/" +
        encodeURIComponent(caseId),
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: status,
                remarks: remarks
            })
        }
    );

    return await response.json();
}

async function getNotifications(email) {

    const response = await fetch(
        API_URL +
        "/api/notifications/student/" +
        encodeURIComponent(email)
    );

    return await response.json();
}

async function markNotificationRead(id) {

    const response = await fetch(
        API_URL +
        "/api/notifications/" +
        id +
        "/read",
        {
            method: "PUT"
        }
    );

    return await response.json();
}

async function markAllNotificationsRead(email) {

    const response = await fetch(
        API_URL +
        "/api/notifications/student/" +
        encodeURIComponent(email) +
        "/read-all",
        {
            method: "PUT"
        }
    );

    return await response.json();
}

function generateCaseId() {

    return "CASE" +
        Date.now().toString().slice(-6);
}

function showMessage(elementId, message, color) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;
    element.style.color = color;
}

function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleString();
}