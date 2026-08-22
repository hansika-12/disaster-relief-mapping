const form = document.getElementById("incidentForm");

const photoInput = document.getElementById("incidentPhoto");
const videoInput = document.getElementById("incidentVideo");

const photoPreview = document.getElementById("photoPreview");
const videoPreview = document.getElementById("videoPreview");

const description = document.getElementById("description");
const charCount = document.getElementById("charCount");

const errorMessage = document.getElementById("errorMessage");


// ------------------------------------
// PHOTO PREVIEW
// ------------------------------------

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

    photoPreview.appendChild(image);
});


// ------------------------------------
// VIDEO PREVIEW
// ------------------------------------

videoInput.addEventListener("change", function () {

    videoPreview.innerHTML = "";

    const file = this.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("video/")) {

        alert("Please select a valid video.");
        this.value = "";
        return;
    }

    const video = document.createElement("video");

    video.src = URL.createObjectURL(file);

    video.controls = true;

    videoPreview.appendChild(video);
});


// ------------------------------------
// DESCRIPTION CHARACTER COUNT
// ------------------------------------

description.addEventListener("input", function () {

    charCount.textContent = this.value.length;

    if (this.value.length > 500) {
        this.value = this.value.substring(0, 500);
        charCount.textContent = 500;
    }
});


// ------------------------------------
// GET CURRENT LOCATION
// ------------------------------------

function getLocation() {

    const locationStatus =
        document.getElementById("locationStatus");

    if (!navigator.geolocation) {

        locationStatus.textContent =
            "❌ Geolocation is not supported by your browser.";

        return;
    }

    locationStatus.textContent =
        "📍 Getting your location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            locationStatus.textContent =
                "📍 Location captured: " +
                latitude.toFixed(6) +
                ", " +
                longitude.toFixed(6);

            // Store location temporarily
            localStorage.setItem(
                "incidentLatitude",
                latitude
            );

            localStorage.setItem(
                "incidentLongitude",
                longitude
            );
        },

        function () {

            locationStatus.textContent =
                "❌ Unable to get location. Please allow location permission.";
        }
    );
}


// ------------------------------------
// FORM SUBMISSION
// ------------------------------------

form.addEventListener("submit", function (event) {

    event.preventDefault();

    errorMessage.textContent = "";


    // Check Photo

    if (photoInput.files.length === 0) {

        errorMessage.textContent =
            "❌ Please upload an incident photo.";

        return;
    }


    // Check Video

    if (videoInput.files.length === 0) {

        errorMessage.textContent =
            "❌ Please upload an incident video.";

        return;
    }


    // Check Description

    if (description.value.trim() === "") {

        errorMessage.textContent =
            "❌ Please describe what happened.";

        return;
    }


    // Everything is valid

    alert(
        "✅ Incident report submitted successfully!"
    );

    // Clear form

    form.reset();

    photoPreview.innerHTML = "";
    videoPreview.innerHTML = "";

    charCount.textContent = "0";

    document.getElementById("locationStatus").textContent =
        "Location not selected.";
});


// ------------------------------------
// BACK TO DASHBOARD
// ------------------------------------

function goBack() {

    window.location.href = "dashboard.html";
}