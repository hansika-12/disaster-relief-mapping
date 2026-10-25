const reports = [

    {
        type: "flood",
        icon: "🌊",
        title: "Flood Alert",
        location: "Wardha Road, Nagpur",
        description: "Heavy waterlogging reported in the area.",
        time: "10 minutes ago",
        severity: "Critical"
    },

    {
        type: "traffic",
        icon: "🚗",
        title: "Traffic Accident",
        location: "Sitabuldi, Nagpur",
        description: "Road accident causing heavy traffic congestion.",
        time: "25 minutes ago",
        severity: severity || 'Moderate',
    },

    {
        type: "fire",
        icon: "🔥",
        title: "Fire Emergency",
        location: "Dharampeth, Nagpur",
        description: "Fire reported near a residential area.",
        time: "40 minutes ago",
        severity: "Critical"
    },

    {
        type: "collapse",
        icon: "🏚️",
        title: "Building Collapse",
        location: "Mahal, Nagpur",
        description: "Partial building collapse reported by citizens.",
        time: "1 hour ago",
        severity: "Critical"
    },

    {
        type: "storm",
        icon: "🌪️",
        title: "Storm Damage",
        location: "Manish Nagar, Nagpur",
        description: "Strong winds have damaged several structures.",
        time: "2 hours ago",
        severity: severity || 'Moderate',
    },

    {
        type: "blockage",
        icon: "🌳",
        title: "Road Blockage",
        location: "Civil Lines, Nagpur",
        description: "Fallen tree blocking the main road.",
        time: "3 hours ago",
        severity: "Resolved"
    }

];


const container =
    document.getElementById("reportsContainer");


function displayReports() {

    container.innerHTML = "";

    reports.forEach(function(report) {

        const card = document.createElement("div");

        card.className = "report-card";

        let severityClass = "";

        if (report.severity === "Critical") {
            severityClass = "critical";
        }
        else if (report.severity === "Moderate") {
            severityClass = "moderate";
        }
        else {
            severityClass = "resolved";
        }


        card.innerHTML = `

            <div class="report-icon ${report.type}">
                ${report.icon}
            </div>

            <div class="report-info">

                <h3>${report.title}</h3>

                <p>📍 ${report.location}</p>

                <p>${report.description}</p>

                <span class="report-time">
                    ${report.time}
                </span>

            </div>

            <span class="severity ${severityClass}">
                ${report.severity}
            </span>

        `;


        container.appendChild(card);

    });

}


displayReports();


// View All button

document.getElementById("viewAllBtn")
    .addEventListener("click", function() {

        alert("All emergency reports will be displayed here.");

    });