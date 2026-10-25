/* =========================================
   DISASTER RELIEF DASHBOARD
========================================= */

let reports = [];

function loadPendingNotifications() {

    const pending = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]"
    );

    const saved = JSON.parse(
        localStorage.getItem("savedNotifications") || "[]"
    );

    // sabse nayi notification sabse upar
    const extra = [...pending.reverse(), ...saved];

    localStorage.setItem(
        "savedNotifications",
        JSON.stringify(extra)
    );

    localStorage.removeItem("pendingNotifications");

    notifications.unshift(...extra);

    loadNotifications();

    updateNotificationCount();
}


function updateNotificationCount() {

    const unread = notifications.filter(n => n.unread).length;

    document.querySelectorAll(
        ".notification-count, .top-notification"
    ).forEach(element => {

        element.textContent = unread;

        element.style.display = unread === 0 ? "none" : "";

    });
}

async function fetchReports() {
    try {
        const response = await fetch('http://localhost:5000/api/reports');
        reports = await response.json();

        loadRecentReports();
        loadMyReports();
        loadResponderReports();
        updateStatistics();
    } catch (error) {
        console.error('Failed to fetch reports:', error);
    }
}


const notifications = [

    {
        icon: "🚨",
        title: "Critical Incident Nearby",
        message:
            "A critical flood has been reported in Central Road.",
        time: "10 minutes ago",
        unread: true
    },

    {
        icon: "✅",
        title: "Report Verified",
        message:
            "Your report DR-098 has been verified by a community member.",
        time: "35 minutes ago",
        unread: true
    },

    {
        icon: "🛟",
        title: "Responder Assigned",
        message:
            "A rescue team has been assigned to Flood DR-104.",
        time: "1 hour ago",
        unread: true
    },

    {
        icon: "📢",
        title: "Community Update",
        message:
            "Emergency shelter is now available near Central School.",
        time: "2 hours ago",
        unread: false
    }

];


/* =========================================
   PAGE NAVIGATION
========================================= */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".dashboard-section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    const selected =
        document.getElementById(sectionId);

    if (selected) {
        selected.classList.remove("hidden");
    }


    const menuItems =
        document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        item.classList.remove("active");
    });


    const clickedMenu =
        Array.from(menuItems).find(item =>
            item.getAttribute("onclick") &&
            item.getAttribute("onclick").includes(sectionId)
        );

    if (clickedMenu) {
        clickedMenu.classList.add("active");
    }


    const titles = {

        dashboard: [
            "Citizen Dashboard",
            "Monitor disasters and help your community."
        ],

        myReports: [
            "My Reports",
            "Track the status of your submitted reports."
        ],

        responders: [
            "Community verification",
            "Verify reports submitted by other community members."
        ],

        notifications: [
            "Notifications",
            "Important alerts and report updates."
        ],

        updates: [
            "Persons & Updates",
            "Community members and emergency updates."
        ]

    };


    if (titles[sectionId]) {

        document.getElementById("pageTitle").textContent =
            titles[sectionId][0];

        document.getElementById("pageSubtitle").textContent =
            titles[sectionId][1];

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   INITIALIZE DASHBOARD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const section = location.hash.replace("#", "");

    if (section) {
        showSection(section);
    }

    fetchReports();

    loadPendingNotifications();

    initializeMap();

});


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStatistics() {

    const active =
        reports.filter(report =>
            report.status !== "Resolved"
        ).length;

    const verified =
        reports.filter(report =>
            report.status === "Verified"
        ).length;


    document.getElementById(
        "activeIncidents"
    ).textContent = active;


    document.getElementById(
        "myReportCount"
    ).textContent = reports.length;


    document.getElementById(
        "verifiedReports"
    ).textContent = verified;

}


/* =========================================
   RECENT REPORTS
========================================= */

function loadRecentReports() {

    const container =
        document.getElementById("recentReports");

    container.innerHTML = "";


    reports.slice(0, 4).forEach(report => {

        const item =
            document.createElement("div");

        item.className = "report-item";


        let icon = "🚨";

        if (report.type === "Flood") icon = "🌊";
        if (report.type === "Fire") icon = "🔥";
        if (report.type === "Earthquake") icon = "🌍";
        if (report.type === "Landslide") icon = "⛰️";


        item.innerHTML = `

            <div class="report-type-icon">
                ${icon}
            </div>

            <div class="report-info">

                <h4>${report.title || report.type}</h4>

                <p>
                    📍 ${report.location_name || "Unknown"}
                </p>

                <span class="status ${getStatusClass(report.status)}">
                    ${report.status}
                </span>

            </div>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   STATUS CLASS
========================================= */

function getStatusClass(status) {

    if (status === "Verified") {
        return "verified";
    }

    if (status === "Rejected") {
        return "rejected";
    }

    return "pending";

}


/* =========================================
   MY REPORTS TABLE
========================================= */

function loadMyReports() {

    const table =
        document.getElementById("myReportsTable");

    table.innerHTML = "";


    reports.forEach(report => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${report.id}</strong>
            </td>

            <td>
                ${report.type}
            </td>

            <td>
                ${report.location_name || "Unknown"}
            </td>

            <td>
                ${new Date(report.created_at).toLocaleDateString()}
            </td>

            <td>
                <span class="status ${getStatusClass(report.status)}">
                    ${report.status}
                </span>
            </td>

            <td>

                <button
                    class="view-btn"
                    onclick="showReportDetails(${report.id})"
                >
                    View Details
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   REPORT DETAILS
========================================= */

function showReportDetails(reportId) {

    const report =
        reports.find(item =>
            item.id === reportId
        );

    if (!report) return;


    alert(
        `Report: ${report.type}\nLocation: ${report.location_name || "Unknown"}\nStatus: ${report.status}\nDescription: ${report.description || "N/A"}`
    );

}


/* =========================================
   RESPONDER REPORTS
========================================= */

function loadResponderReports() {

    const container =
        document.getElementById(
            "responderReports"
        );

    container.innerHTML = "";


    const pendingReports =
        reports.filter(report =>
            report.status === "Pending"
        );


    pendingReports.forEach(report => {

        const item =
            document.createElement("div");

        item.className =
            "responder-report";


        item.innerHTML = `

            <div class="responder-report-header">

                <div>

                    <h4>
                        ${report.type} -
                        ${report.title || ""}
                    </h4>

                    <p>
                        📍 ${report.location_name || "Unknown"}
                    </p>

                    <p>
                        👥 ${report.people_affected || 0}
                        people affected
                    </p>

                </div>

                <span class="status pending">
                    Pending
                </span>

            </div>


            <p>
                ${report.description || ""}
            </p>


            <div class="action-buttons">

                <button
                    class="verify-btn"
                    onclick="verifyReport(${report.id})"
                >
                    ✓ Verify
                </button>

                <button
                    class="reject-btn"
                    onclick="rejectReport(${report.id})"
                >
                    ✕ Reject
                </button>

            </div>

        `;


        container.appendChild(item);

    });


    if (pendingReports.length === 0) {

        container.innerHTML = `
            <p style="
                text-align:center;
                padding:30px;
                color:#64748b;
                font-size:13px;
            ">
                No reports waiting for verification.
            </p>
        `;

    }

}


/* =========================================
   VERIFY REPORT
========================================= */

function addNotification(icon, title, message) {

    const notification = {
        icon: icon,
        title: title,
        message: message,
        time: "Just now",
        unread: true
    };

    notifications.unshift(notification);

    const saved = JSON.parse(
        localStorage.getItem("savedNotifications") || "[]"
    );

    saved.unshift(notification);

    localStorage.setItem(
        "savedNotifications",
        JSON.stringify(saved)
    );

    loadNotifications();

    updateNotificationCount();
}


async function verifyReport(reportId) {

    try {

        const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Verified", verified_by: localStorage.getItem("loginEmail") || "Unknown" })
        });

        if (!response.ok) {
            throw new Error("Failed to verify report");
        }

        const report = reports.find(r => r.id === reportId);
        const name = report ? (report.title || report.type) : `#${reportId}`;

        await fetchReports();

        addNotification(
            "✅",
            "Report Verified",
            `Your report "${name}" has been verified by a community member.`
        );

        alert(`Report ${reportId} has been verified successfully.`);

    } catch (error) {
        console.error("Error verifying report:", error);
        alert("Something went wrong. Please try again.");
    }

}


async function rejectReport(reportId) {

    const confirmReject = confirm(
        "Are you sure you want to reject this report?"
    );

    if (!confirmReject) return;

    try {

        const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Rejected", verified_by: localStorage.getItem("loginEmail") || "Unknown" })
        });

        if (!response.ok) {
            throw new Error("Failed to reject report");
        }

        const report = reports.find(r => r.id === reportId);
        const name = report ? (report.title || report.type) : `#${reportId}`;

        await fetchReports();

        addNotification(
            "❌",
            "Report Rejected",
            `Your report "${name}" was rejected by a community member.`
        );

        alert(`Report ${reportId} has been rejected.`);

    } catch (error) {
        console.error("Error rejecting report:", error);
        alert("Something went wrong. Please try again.");
    }

}


/* =========================================
   NOTIFICATIONS
========================================= */

function loadNotifications() {

    const container =
        document.getElementById(
            "notificationList"
        );

    container.innerHTML = "";


    notifications.forEach((notification, index) => {

        const item =
            document.createElement("div");

        item.className =
            "notification-item" +
            (notification.unread ? " unread" : "");


        item.innerHTML = `

            <div class="notification-icon">
                ${notification.icon}
            </div>

            <div>

                <h4>
                    ${notification.title}
                </h4>

                <p>
                    ${notification.message}
                </p>

                <small>
                    ${notification.time}
                </small>

            </div>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   MARK NOTIFICATIONS READ
========================================= */

function markAllRead() {

    notifications.forEach(notification => {
        notification.unread = false;
    });


    loadNotifications();


    document.querySelectorAll(
        ".notification-count, .top-notification"
    ).forEach(element => {

        element.style.display = "none";

    });

}


/* =========================================
   LEAFLET MAP
========================================= */

let disasterMap;


function initializeMap() {

    disasterMap =
        L.map("disasterMap")
        .setView(
            [21.1458, 79.0882],
            12
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(disasterMap);

}


/* =========================================
   LOCATE USER
========================================= */

function locateUser() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            disasterMap.setView(
                [lat, lng],
                15
            );


            L.marker([lat, lng])
                .addTo(disasterMap)
                .bindPopup(
                    "<strong>Your Location</strong>"
                )
                .openPopup();

        },

        () => {

            alert(
                "Unable to access your location."
            );

        }

    );

}


/* =========================================
   SEARCH MAP LOCATION
========================================= */

let searchMarker = null;

async function searchMapLocation() {

    const input =
        document.getElementById("mapSearchInput");

    const query = input.value.trim();


    if (query === "") {
        alert("Please enter a location to search.");
        return;
    }


    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );

        const data = await response.json();


        if (data.length === 0) {
            alert("Location not found. Please try again.");
            return;
        }


        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);


        disasterMap.setView([lat, lng], 15);


        if (searchMarker) {
            disasterMap.removeLayer(searchMarker);
        }

        searchMarker =
            L.marker([lat, lng])
                .addTo(disasterMap)
                .bindPopup(query)
                .openPopup();

    } catch (error) {

        console.error("Search failed:", error);
        alert("Something went wrong while searching.");

    }

}


function logout() {

    window.location.href = "index.html";

}
/* =========================================
   NOTIFICATION COUNT FIX
========================================= */

// purani 4 fake notifications ko "seen" maan lo
notifications.forEach(n => n.unread = false);


// notifications dekh li gayi: unread hata do, count 0 karo
function markNotificationsSeen() {

    notifications.forEach(n => n.unread = false);

    const saved = JSON.parse(
        localStorage.getItem("savedNotifications") || "[]"
    );

    saved.forEach(n => n.unread = false);

    localStorage.setItem(
        "savedNotifications",
        JSON.stringify(saved)
    );

    updateNotificationCount();
}


// "Mark all as read" button
function markAllRead() {
    markNotificationsSeen();
    loadNotifications();
}


// page khulte waqt notifications load karo
function loadPendingNotifications() {

    const pending = JSON.parse(
        localStorage.getItem("pendingNotifications") || "[]"
    );

    const saved = JSON.parse(
        localStorage.getItem("savedNotifications") || "[]"
    );

    const all = [...pending.reverse(), ...saved];

    localStorage.setItem("savedNotifications", JSON.stringify(all));
    localStorage.removeItem("pendingNotifications");

    notifications.unshift(...all);

    loadNotifications();
    updateNotificationCount();

    const section = document.getElementById("notifications");

    if (section && !section.classList.contains("hidden")) {
        markNotificationsSeen();
    }
}


// Notifications section kholte hi count 0 ho jaye
const _showSection = showSection;

showSection = function (sectionId) {

    _showSection(sectionId);

    if (sectionId === "notifications") {
        markNotificationsSeen();
    }
};
/* =========================================
   MAP DISPLAY FIX
========================================= */

window.addEventListener("load", () => {
    setTimeout(() => {
        if (disasterMap) disasterMap.invalidateSize();
    }, 300);
});

const _showSectionMap = showSection;

showSection = function (sectionId) {

    _showSectionMap(sectionId);

    if (sectionId === "dashboard" && disasterMap) {
        setTimeout(() => disasterMap.invalidateSize(), 200);
    }
};
/* =========================================
   MAP MARKERS
========================================= */

let reportLayer = null;


function escapeHtml(text) {
    return String(text ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}


function getMarkerColor(report) {

    if (report.status === "Resolved") {
        return "#16a34a";          // hara
    }

    const severity = (report.severity || "").toLowerCase();

    if (severity === "critical" || severity === "high") {
        return "#dc2626";          // laal
    }

    return "#f59e0b";              // narangi
}


function drawReportMarkers() {

    if (typeof disasterMap === "undefined" || !disasterMap) return;

    if (reportLayer) {
        reportLayer.clearLayers();
    } else {
        reportLayer = L.layerGroup().addTo(disasterMap);
    }

    reports.forEach(report => {

        if (report.status === "Rejected") return;

        const lat = parseFloat(report.latitude);
        const lng = parseFloat(report.longitude);

        if (isNaN(lat) || isNaN(lng)) return;

        L.circleMarker([lat, lng], {
            radius: 9,
            color: "#ffffff",
            weight: 2,
            fillColor: getMarkerColor(report),
            fillOpacity: 0.95
        })
        .bindPopup(`
            <strong>${escapeHtml(report.title || report.type)}</strong><br>
            ${escapeHtml(report.type)} • ${escapeHtml(report.severity || "N/A")}<br>
            📍 ${escapeHtml(report.location_name || "Unknown")}<br>
            👥 ${escapeHtml(report.people_affected || 0)} people affected<br>
            Status: <strong>${escapeHtml(report.status)}</strong>
        `)
        .addTo(reportLayer);

    });
}


// reports aate hi markers bhi ban jayein
const _updateStatisticsMarkers = updateStatistics;

updateStatistics = function () {
    _updateStatisticsMarkers();
    drawReportMarkers();
};
function getMarkerColor(report) {

    if (report.status === "Resolved") {
        return "#16a34a";          // hara
    }

    const severity = (report.severity || "").toLowerCase();

    if (severity === "critical") {
        return "#dc2626";          // laal
    }

    if (severity === "low") {
        return "#2563eb";          // neela
    }

    return "#f59e0b";              // narangi (Moderate)
}
function getMarkerColor(report) {

    const severity = (report.severity || "").toLowerCase();

    if (severity === "critical") {
        return "#dc2626";          // laal
    }

    if (severity === "low") {
        return "#2563eb";          // neela
    }

    return "#f59e0b";              // narangi (Moderate)
}
/* =========================================
   LEDGER INTEGRITY CHECK
========================================= */

async function checkIntegrity() {

    const box = document.getElementById("ledgerResult");

    box.style.color = "#64748b";
    box.textContent = "Checking...";

    try {

        const res = await fetch(
            "http://localhost:5000/api/reports/ledger/verify"
        );

        const data = await res.json();

        if (data.valid) {

            box.style.color = "#166534";
            box.textContent =
                "✅ All good. " + data.total_blocks +
                " ledger blocks checked, no tampering found.";

        } else {

            const ids = [...new Set(
                data.problems
                    .map(p => p.report_id)
                    .filter(id => id !== undefined)
            )];

            box.style.color = "#991b1b";
            box.textContent =
                "⚠️ Tampering detected! Problem in report(s): " +
                (ids.join(", ") || "ledger");
        }

    } catch (error) {

        box.style.color = "#991b1b";
        box.textContent = "Could not reach the server.";
    }
}
/* =========================================
   LEDGER BADGES
========================================= */

function ledgerBadgeHtml(report) {

    if (report.ledger_status === "tampered") {
        return '<span class="ledger-badge tampered">⚠️ Tampered</span>';
    }

    if (report.ledger_status === "sealed") {
        return '<span class="ledger-badge sealed">🔗 Sealed</span>';
    }

    return "";
}


// Recent Reports me badge
const _loadRecentReportsBadge = loadRecentReports;

loadRecentReports = function () {

    _loadRecentReportsBadge();

    const items = document.querySelectorAll("#recentReports .report-item");

    reports.slice(0, 4).forEach((report, i) => {

        const info = items[i] && items[i].querySelector(".report-info");

        if (info) {
            info.insertAdjacentHTML("beforeend", " " + ledgerBadgeHtml(report));
        }

    });
};


// My Reports table me badge
const _loadMyReportsBadge = loadMyReports;

loadMyReports = function () {

    _loadMyReportsBadge();

    const rows = document.querySelectorAll("#myReportsTable tr");

    reports.forEach((report, i) => {

        const cell = rows[i] && rows[i].children[4];

        if (cell) {
            cell.insertAdjacentHTML("beforeend", " " + ledgerBadgeHtml(report));

        }

    });
};
/* =========================================
   VERIFY / REJECT (with verified_by)
========================================= */

async function verifyReport(reportId) {

    try {

        const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "Verified",
                verified_by: localStorage.getItem("loginEmail") || "Unknown"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to verify report");
        }

        const report = reports.find(r => r.id === reportId);
        const name = report ? (report.title || report.type) : `#${reportId}`;

        await fetchReports();

        addNotification(
            "✅",
            "Report Verified",
            `Your report "${name}" has been verified by a community member.`
        );

        alert(`Report ${reportId} has been verified successfully.`);

    } catch (error) {
        console.error("Error verifying report:", error);
        alert("Something went wrong. Please try again.");
    }
}


async function rejectReport(reportId) {

    const confirmReject = confirm(
        "Are you sure you want to reject this report?"
    );

    if (!confirmReject) return;

    try {

        const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "Rejected",
                verified_by: localStorage.getItem("loginEmail") || "Unknown"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to reject report");
        }

        const report = reports.find(r => r.id === reportId);
        const name = report ? (report.title || report.type) : `#${reportId}`;

        await fetchReports();

        addNotification(
            "❌",
            "Report Rejected",
            `Your report "${name}" was rejected by a community member.`
        );

        alert(`Report ${reportId} has been rejected.`);

    } catch (error) {
        console.error("Error rejecting report:", error);
        alert("Something went wrong. Please try again.");
    }
}
/* =========================================
   LEDGER + VERIFICATION BADGES
========================================= */

function ledgerBadgeHtml(report) {

    let html = "";

    if (report.ledger_status === "tampered") {
        html += '<span class="ledger-badge tampered">⚠️ Tampered</span>';
    } else if (report.ledger_status === "sealed") {
        html += '<span class="ledger-badge sealed">🔗 Sealed</span>';
    }

    if (report.status === "Verified" && report.verification_type === "peer") {
        html += ' <span class="ledger-badge peer">👥 Peer-verified</span>';
    }

    if (report.status === "Verified" && report.verification_type === "self") {
        html += ' <span class="ledger-badge self">☝️ Self-verified</span>';
    }

    return html;
}
/* =========================================
   MY REPORTS: sirf apni reports
========================================= */

function myEmail() {
    return (localStorage.getItem("loginEmail") || "").trim().toLowerCase();
}

function isMine(report) {
    return String(report.reported_by || "").trim().toLowerCase() === myEmail();
}


loadMyReports = function () {

    const table = document.getElementById("myReportsTable");

    table.innerHTML = "";

    const mine = reports.filter(isMine);

    if (mine.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:30px; color:#64748b;">
                    You have not submitted any reports yet.
                </td>
            </tr>
        `;

        return;
    }

    mine.forEach(report => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td><strong>${report.id}</strong></td>

            <td>${escapeHtml(report.type)}</td>

            <td>${escapeHtml(report.location_name || "Unknown")}</td>

            <td>${new Date(report.created_at).toLocaleDateString()}</td>

            <td>
                <span class="status ${getStatusClass(report.status)}">
                    ${report.status}
                </span>
                ${ledgerBadgeHtml(report)}
            </td>

            <td>
                <button class="view-btn" onclick="showReportDetails(${report.id})">
                    View Details
                </button>
            </td>

        `;

        table.appendChild(row);
    });
};


// dashboard ke "My Reports" count me bhi sirf apni reports
const _updateStatisticsMine = updateStatistics;

updateStatistics = function () {

    _updateStatisticsMine();

    document.getElementById("myReportCount").textContent =
        reports.filter(isMine).length;
};
/* =========================================
   PERSONS & UPDATES (real data)
========================================= */

function timeAgo(iso) {

    const s = Math.floor((Date.now() - new Date(iso)) / 1000);

    if (s < 60) return "Just now";
    if (s < 3600) return Math.floor(s / 60) + " min ago";
    if (s < 86400) return Math.floor(s / 3600) + " hours ago";

    return Math.floor(s / 86400) + " days ago";
}


function shortName(email) {

    const e = String(email || "Someone");

    return e.includes("@") ? e.split("@")[0] : e;
}


async function loadPersonsAndUpdates() {

    const section = document.getElementById("updates");
    const grid = section.querySelector(".updates-grid");

    if (!grid) return;

    const reporters = reports.map(r => r.reported_by).filter(Boolean);
    const verifiers = reports.map(r => r.verified_by).filter(Boolean);

    const everyone = new Set([...reporters, ...verifiers]);
    const onlyVerifiers = new Set(verifiers);

    grid.innerHTML = `

        <div class="person-card">
            <div class="large-avatar">👥</div>
            <h3>Community Members</h3>
            <p>${everyone.size} people have reported or verified incidents.</p>
            <span class="person-status">● Active</span>
        </div>

        <div class="person-card">
            <div class="large-avatar">✅</div>
            <h3>Verifiers</h3>
            <p>${onlyVerifiers.size} people have verified or rejected reports.</p>
            <span class="person-status">● Active</span>
        </div>
    `;

    let feedHtml = "";

    try {

        const res = await fetch("http://localhost:5000/api/reports/ledger");
        const ledger = await res.json();

        const recent = [...ledger]
            .filter(b => b.action !== "IMPORTED")
            .reverse()
            .slice(0, 8);

        feedHtml = recent.map(b => {

            const report = reports.find(r => r.id === b.report_id);
            const title = escapeHtml(report ? (report.title || report.type) : "a report");

            let icon = "🚨";
            let text = `${escapeHtml(shortName(report && report.reported_by))} reported "${title}"`;

            if (b.action === "VERIFIED") {

                icon = "✅";

                const how = b.verification_type
                    ? ` (${b.verification_type})`
                    : "";

                text = `${escapeHtml(shortName(b.verified_by))} verified "${title}"${how}`;
            }

            if (b.action === "REJECTED") {

                icon = "❌";

                text = `${escapeHtml(shortName(b.verified_by))} rejected "${title}"`;
            }

            return `
                <div class="feed-item">
                    <span>${icon}</span>
                    <div>
                        <strong>${text}</strong>
                        <p><small>${timeAgo(b.timestamp)}</small></p>
                    </div>
                </div>
            `;

        }).join("");

    } catch (error) {

        console.error("Could not load activity:", error);
    }

    if (feedHtml === "") {
        feedHtml = '<p style="color:#64748b; font-size:12px;">No activity yet.</p>';
    }

    let feed = document.getElementById("activityFeed");

    if (!feed) {

        feed = document.createElement("div");
        feed.className = "panel";
        feed.id = "activityFeed";

        section.appendChild(feed);
    }

    feed.innerHTML = `
        <div class="panel-header">
            <div>
                <h3>Recent Activity</h3>
                <p>Latest reports and verifications</p>
            </div>
        </div>
        ${feedHtml}
    `;
}


const _updateStatisticsPersons = updateStatistics;

updateStatistics = function () {

    _updateStatisticsPersons();
    loadPersonsAndUpdates();
};
/* =========================================
   RESPONDER NUMBERS (real data)
========================================= */

function updateResponderNumbers() {

    const me = (localStorage.getItem("loginEmail") || "")
        .trim().toLowerCase();

    const verifiers = new Set(
        reports
            .map(r => r.verified_by)
            .filter(v => v && v !== "Unknown")
    );

    const pending = reports.filter(r => r.status === "Pending");

    const waiting = pending.filter(r =>
        String(r.reported_by || "").trim().toLowerCase() !== me
    );

    const verified = reports.filter(r => r.status === "Verified");

    const peer = verified.filter(r => r.verification_type === "peer").length;
    const self = verified.filter(r => r.verification_type === "self").length;


    // Dashboard ke upar wala card
    const active = document.getElementById("respondersActive");

    if (active) {

        active.textContent = verifiers.size;

        const label = active.parentElement.querySelector("span");

        if (label) label.textContent = "Active Verifiers";
    }


    // Responder Status box
    const boxValues = [verifiers.size, peer, self, pending.length];

    const boxLabels = [
        "Active Verifiers",
        "Peer-verified",
        "Self-verified",
        "Awaiting Verification"
    ];

    document
        .querySelectorAll(".responder-status .response-item")
        .forEach((item, i) => {

            if (boxValues[i] === undefined) return;

            item.querySelector("strong").textContent = boxValues[i];
            item.querySelector("span").textContent = boxLabels[i];
        });


    // Community verification ke 3 cards
    const cardValues = [pending.length, waiting.length, verified.length];

    const cardLabels = [
        "Pending Reports",
        "Waiting for a Peer",
        "Verified Reports"
    ];

    document
        .querySelectorAll("#responders .stat-card")
        .forEach((card, i) => {

            if (cardValues[i] === undefined) return;

            card.querySelector("h3").textContent = cardValues[i];
            card.querySelector("span").textContent = cardLabels[i];
        });
}


const _updateStatisticsResponders = updateStatistics;

updateStatistics = function () {

    _updateStatisticsResponders();
    updateResponderNumbers();
};
/* =========================================
   NOTIFICATIONS FROM SERVER
========================================= */

function notifTimeAgo(iso) {

    const s = Math.floor((Date.now() - new Date(iso)) / 1000);

    if (s < 60) return "Just now";
    if (s < 3600) return Math.floor(s / 60) + " min ago";
    if (s < 86400) return Math.floor(s / 3600) + " hours ago";

    return Math.floor(s / 86400) + " days ago";
}


function notifUser() {
    return (localStorage.getItem("loginEmail") || "").trim().toLowerCase();
}


async function loadServerNotifications() {

    const me = notifUser();

    if (!me) return;

    try {

        const res = await fetch(
            "http://localhost:5000/api/notifications?user=" + encodeURIComponent(me)
        );

        const list = await res.json();

        notifications.length = 0;

        list.forEach(n => {
            notifications.push({
                icon: n.icon,
                title: n.title,
                message: n.message,
                time: notifTimeAgo(n.created_at),
                unread: n.unread
            });
        });

        loadNotifications();
        updateNotificationCount();

        // Notifications section khula hai toh seedha "seen" maan lo
        const section = document.getElementById("notifications");

        if (section && !section.classList.contains("hidden")) {
            markNotificationsSeen();
        }

    } catch (error) {
        console.error("Could not load notifications:", error);
    }
}


// page khulte hi server se notifications lo
function loadPendingNotifications() {

    localStorage.removeItem("pendingNotifications");
    localStorage.removeItem("savedNotifications");

    loadServerNotifications();
}


// notifications dekh li: count 0 aur server ko batao
function markNotificationsSeen() {

    const hadUnread = notifications.some(n => n.unread);

    notifications.forEach(n => n.unread = false);

    updateNotificationCount();

    if (!hadUnread) return;

    fetch("http://localhost:5000/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: notifUser() })
    }).catch(() => {});
}


// verify ya reject ke baad list dobara server se lo
function addNotification() {
    loadServerNotifications();
}


// har 10 second me nayi notification check karo
setInterval(loadServerNotifications, 10000);