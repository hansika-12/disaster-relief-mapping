// Default map location
// You can change these coordinates if you want
const defaultLatitude = 21.1458;
const defaultLongitude = 79.0882;

// Create map
const map = L.map("map").setView(
    [defaultLatitude, defaultLongitude],
    13
);

// OpenStreetMap tiles
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

let currentMarker = null;
let watchId = null;


// ------------------------------------
// GET CURRENT LIVE LOCATION
// ------------------------------------

function getCurrentLocation() {

    if (!navigator.geolocation) {

        document.getElementById("locationStatus").innerText =
            "Geolocation is not supported by this browser.";

        return;
    }

    document.getElementById("locationStatus").innerText =
        "Getting your location... Please allow location permission.";

    // Start watching user's location
    watchId = navigator.geolocation.watchPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Show coordinates
            document.getElementById("latitude").innerText =
                latitude.toFixed(6);

            document.getElementById("longitude").innerText =
                longitude.toFixed(6);

            document.getElementById("locationStatus").innerText =
                "📍 Live location detected.";

            // Remove previous marker
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            // Add new marker
            currentMarker = L.marker(
                [latitude, longitude]
            ).addTo(map);

            currentMarker
                .bindPopup("📍 Your Current Location")
                .openPopup();

            // Move map to current location
            map.setView(
                [latitude, longitude],
                16
            );
        },

        function(error) {

            if (error.code === 1) {

                document.getElementById("locationStatus").innerText =
                    "❌ Location permission was denied.";

            } else if (error.code === 2) {

                document.getElementById("locationStatus").innerText =
                    "❌ Location is currently unavailable.";

            } else {

                document.getElementById("locationStatus").innerText =
                    "❌ Unable to get your location.";
            }
        },

        {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 10000
        }
    );
}


// ------------------------------------
// SEARCH LOCATION
// ------------------------------------

async function searchLocation() {

    const locationInput =
        document.getElementById("locationInput").value.trim();

    if (locationInput === "") {

        alert("Please enter a location.");
        return;
    }

    document.getElementById("locationStatus").innerText =
        "Searching location...";

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`
        );

        const data = await response.json();

        if (data.length === 0) {

            document.getElementById("locationStatus").innerText =
                "❌ Location not found.";

            return;
        }

        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        // Move map
        map.setView(
            [latitude, longitude],
            15
        );

        // Remove old marker
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        // Add searched location marker
        currentMarker = L.marker(
            [latitude, longitude]
        ).addTo(map);

        currentMarker
            .bindPopup("📍 " + locationInput)
            .openPopup();

        document.getElementById("latitude").innerText =
            latitude.toFixed(6);

        document.getElementById("longitude").innerText =
            longitude.toFixed(6);

        document.getElementById("locationStatus").innerText =
            "📍 Location found: " + data[0].display_name;

    } catch (error) {

        console.error(error);

        document.getElementById("locationStatus").innerText =
            "❌ Error while searching for location.";
    }
}