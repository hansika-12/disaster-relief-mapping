// ---------- LOCATION CAPTURE ----------

let userLat = null;
let userLng = null;

const useLocationBtn = document.getElementById("useLocationBtn");
const locationStatus = document.getElementById("locationStatus");

useLocationBtn.addEventListener("click", function () {

    if (!navigator.geolocation) {
        locationStatus.textContent = "Geolocation not supported by your browser.";
        return;
    }

    locationStatus.textContent = "Fetching your location...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            locationStatus.textContent =
                `Location captured: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`;
        },
        function (error) {
            locationStatus.textContent =
                "Could not fetch location. Please allow permission or type manually.";
        }
    );
});


// ---------- PHOTO PREVIEW ----------

const photoInput = document.getElementById("incidentPhoto");
const photoPreview = document.getElementById("photoPreview");

photoInput.addEventListener("change", function () {

    photoPreview.innerHTML = "";

    const file = this.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image.");
        this.value = "";
        return;
    }

    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.alt = "Incident Photo Preview";
    image.style.maxWidth = "200px";
    image.style.marginTop = "10px";
    image.style.borderRadius = "8px";

    photoPreview.appendChild(image);
});


// ---------- FORM SUBMIT ----------

document
    .getElementById("incidentForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const type =
            document.getElementById("incidentType").value;

        const severity =
            document.getElementById("severity").value;

        const title =
            document.getElementById("incidentTitle").value;

        const description =
            document.getElementById("incidentDescription").value;

        const location_name =
            document.getElementById("incidentLocation").value;

        const people_affected =
            document.getElementById("peopleAffected").value;

        const newReport = {
            type: type,
            title: title,
            description: description,
            location_name: location_name,
            latitude: userLat !== null ? userLat : 21.1458,
            longitude: userLng !== null ? userLng : 79.0882,
            people_affected: people_affected,
            severity: severity,
            reported_by: localStorage.getItem("loginEmail") || "Anonymous"
        };

        try {

            const response = await fetch("http://localhost:5000/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newReport)
            });

            if (!response.ok) {
                throw new Error("Failed to submit report");
            }

            const pendingNotifications = JSON.parse(
                localStorage.getItem("pendingNotifications") || "[]"
            );

            pendingNotifications.push({
                icon: "🚨",
                title: "New Report Submitted",
                message: `Your report "${title}" has been submitted and is pending verification.`,
                time: "Just now",
                unread: true
            });

            localStorage.setItem(
                "pendingNotifications",
                JSON.stringify(pendingNotifications)
            );

            console.log("Saved to localStorage:", pendingNotifications);

            alert("Your incident report has been submitted successfully!");

            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Something went wrong. Please check your connection and try again.");
        }

    });