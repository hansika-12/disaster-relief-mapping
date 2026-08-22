/* =========================================
   DISASTER RELIEF DASHBOARD
========================================= */


/* =========================================
   SAMPLE DATA
========================================= */

const reports = [

    {
        id: "DR-104",
        type: "Flood",
        title: "Waterlogging near Main Road",
        location: "Central Road",
        date: "21 Aug 2026",
        severity: "Critical",
        status: "Verified",
        people: 120,
        description:
            "Heavy rainfall has caused severe waterlogging."
    },

    {
        id: "DR-103",
        type: "Fire",
        title: "Building Fire Reported",
        location: "Market Area",
        date: "21 Aug 2026",
        severity: "Critical",
        status: "Pending",
        people: 35,
        description:
            "Fire reported inside a commercial building."
    },

    {
        id: "DR-102",
        type: "Landslide",
        title: "Road Blocked Due To Landslide",
        location: "Hill Road",
        date: "20 Aug 2026",
        severity: "Moderate",
        status: "Verified",
        people: 60,
        description:
            "Landslide has blocked traffic on the main road."
    },

    {
        id: "DR-101",
        type: "Earthquake",
        title: "Minor Earthquake Felt",
        location: "North Zone",
        date: "20 Aug 2026",
        severity: "Low",
        status: "Verified",
        people: 15,
        description:
            "Residents reported minor earthquake vibrations."
    }

];


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
            "Your report DR-098 has been verified by a responder.",
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


    /* Update sidebar */

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


    /* Update title */

    const titles = {

        dashboard: [
            "Citizen Dashboard",
            "Monitor disasters and help your community."
        ],

        report: [
            "Report New Incident",
            "Submit accurate information about a disaster."
        ],

        myReports: [
            "My Reports",
            "Track the status of your submitted reports."
        ],

        responders: [
            "Responder Dashboard",
            "Verify incidents and manage emergency response."
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

    loadRecentReports();

    loadMyReports();

    loadResponderReports();

    loadNotifications();

    initializeMap();

    updateStatistics();

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
    ).textContent = active + 8;


    document.getElementById(
        "myReportCount"
    ).textContent = reports.length;


    document.getElementById(
        "verifiedReports"
    ).textContent = verified + 25;

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

                <h4>${report.title}</h4>

                <p>
                    📍 ${report.location}
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
                ${report.location}
            </td>

            <td>
                ${report.date}
            </td>

            <td>
                <span class="status ${getStatusClass(report.status)}">
                    ${report.status}
                </span>
            </td>

            <td>

                <button
                    class="view-btn"
                    onclick="showReportDetails('${report.id}')"
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


    const details =
        document.getElementById("modalDetails");


    details.innerHTML = `

        <div class="detail-row">
            <span>Report ID</span>
            <strong>${report.id}</strong>
        </div>

        <div class="detail-row">
            <span>Incident Type</span>
            <strong>${report.type}</strong>
        </div>

        <div class="detail-row">
            <span>Title</span>
            <strong>${report.title}</strong>
        </div>

        <div class="detail-row">
            <span>Location</span>
            <strong>${report.location}</strong>
        </div>

        <div class="detail-row">
            <span>Severity</span>
            <strong>${report.severity}</strong>
        </div>

        <div class="detail-row">
            <span>People Affected</span>
            <strong>${report.people}</strong>
        </div>

        <div class="detail-row">
            <span>Status</span>
            <strong>${report.status}</strong>
        </div>

        <div class="detail-row">
            <span>Description</span>
            <strong>${report.description}</strong>
        </div>

    `;


    document
        .getElementById("reportModal")
        .classList.add("show");

}


function closeModal() {

    document
        .getElementById("reportModal")
        .classList.remove("show");

}


/* =========================================
   INCIDENT FORM
========================================= */

document
    .getElementById("incidentForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const type =
            document.getElementById(
                "incidentType"
            ).value;

        const severity =
            document.getElementById(
                "severity"
            ).value;

        const title =
            document.getElementById(
                "incidentTitle"
            ).value;

        const description =
            document.getElementById(
                "incidentDescription"
            ).value;

        const location =
            document.getElementById(
                "incidentLocation"
            ).value;

        const people =
            document.getElementById(
                "peopleAffected"
            ).value;


        const newReport = {

            id:
                "DR-" +
                (105 + reports.length),

            type: type,

            title: title,

            location: location,

            date: "21 Aug 2026",

            severity: severity,

            status: "Pending",

            people: people,

            description: description

        };


        reports.unshift(newReport);


        loadRecentReports();

        loadMyReports();

        loadResponderReports();

        updateStatistics();


        alert(
            "Your incident report has been submitted successfully!"
        );


        this.reset();


        showSection("myReports");

    });


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
                        ${report.title}
                    </h4>

                    <p>
                        📍 ${report.location}
                    </p>

                    <p>
                        👥 ${report.people}
                        people affected
                    </p>

                </div>

                <span class="status pending">
                    Pending
                </span>

            </div>


            <p>
                ${report.description}
            </p>


            <div class="action-buttons">

                <button
                    class="verify-btn"
                    onclick="verifyReport('${report.id}')"
                >
                    ✓ Verify
                </button>

                <button
                    class="reject-btn"
                    onclick="rejectReport('${report.id}')"
                >
                    ✕ Reject
                </button>

                <button
                    class="view-btn"
                    onclick="showReportDetails('${report.id}')"
                >
                    View Details
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

function verifyReport(reportId) {

    const report =
        reports.find(item =>
            item.id === reportId
        );


    if (!report) return;


    report.status = "Verified";


    loadRecentReports();

    loadMyReports();

    loadResponderReports();

    updateStatistics();


    alert(
        `${report.id} has been verified successfully.`
    );

}


/* =========================================
   REJECT REPORT
========================================= */

function rejectReport(reportId) {

    const report =
        reports.find(item =>
            item.id === reportId
        );


    if (!report) return;


    const confirmReject =
        confirm(
            "Are you sure you want to reject this report?"
        );


    if (!confirmReject) return;


    report.status = "Rejected";


    loadRecentReports();

    loadMyReports();

    loadResponderReports();

    updateStatistics();


    alert(
        `${report.id} has been rejected.`
    );

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


    const locations = [

        {
            lat: 21.1458,
            lng: 79.0882,
            title: "Flood - Central Road",
            status: "Critical"
        },

        {
            lat: 21.155,
            lng: 79.095,
            title: "Building Fire - Market Area",
            status: "Critical"
        },

        {
            lat: 21.132,
            lng: 79.078,
            title: "Landslide - Hill Road",
            status: "Moderate"
        },

        {
            lat: 21.16,
            lng: 79.07,
            title: "Earthquake Report",
            status: "Resolved"
        }

    ];


    locations.forEach(location => {

        let markerColor = "#dc2626";

        if (location.status === "Moderate") {
            markerColor = "#f59e0b";
        }

        if (location.status === "Resolved") {
            markerColor = "#16a34a";
        }


        const icon =
            L.divIcon({

                className: "custom-map-marker",

                html: `
                    <div style="
                        width:18px;
                        height:18px;
                        background:${markerColor};
                        border:3px solid white;
                        border-radius:50%;
                        box-shadow:
                        0 2px 6px rgba(0,0,0,0.3);
                    "></div>
                `,

                iconSize: [18, 18],

                iconAnchor: [9, 9]

            });


        L.marker(
            [location.lat, location.lng],
            { icon: icon }
        )
        .addTo(disasterMap)
        .bindPopup(`
            <strong>
                ${location.title}
            </strong>
            <br>
            Status: ${location.status}
        `);

    });

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
   LOGOUT
========================================= */

function logout() {

    const confirmLogout =
        confirm(
            "Do you want to logout?"
        );


    if (!confirmLogout) return;

    window.location.href = "login.html";

}


/* =========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================= */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "reportModal"
            );


        if (event.target === modal) {
            closeModal();
        }

    }
);