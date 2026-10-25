// frontend-example.js
// Copy the relevant parts of this into your existing dashboard/report-form JS file.
// This shows how your HTML/CSS/JS frontend talks to the backend.

const API_BASE = 'http://localhost:5000/api/reports';

// ------------------------------------------------------------
// 1) SUBMIT a new incident report (call this on your form's submit event)
// ------------------------------------------------------------
async function submitReport(formData) {
  // formData example (get these values from your form's input fields):
  // {
  //   type: "Fire",
  //   description: "Building on fire near market area",
  //   location_name: "Market Area",
  //   latitude: 21.1458,
  //   longitude: 79.0882,
  //   reported_by: "Citizen"
  // }

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    console.log('Report saved:', data.report);
    alert('Report submitted successfully!');
    return data.report;
  } catch (err) {
    console.error('Failed to submit report:', err);
    alert('Failed to submit report. Please try again.');
  }
}

// Example: wire this up to your actual form
// document.getElementById('incidentForm').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const formData = {
//     type: document.getElementById('type').value,
//     description: document.getElementById('description').value,
//     location_name: document.getElementById('locationName').value,
//     latitude: parseFloat(document.getElementById('lat').value),
//     longitude: parseFloat(document.getElementById('lng').value),
//     reported_by: 'Citizen'
//   };
//   await submitReport(formData);
// });


// ------------------------------------------------------------
// 2) LOAD all reports (call this when the dashboard page loads,
//    to populate the Live Map and "Recent Reports" list)
// ------------------------------------------------------------
async function loadReports() {
  try {
    const response = await fetch(API_BASE);
    const reports = await response.json();

    console.log('All reports:', reports);

    // Example: add each report as a marker on your Leaflet map
    // reports.forEach(r => {
    //   L.marker([r.latitude, r.longitude])
    //     .addTo(map)
    //     .bindPopup(`<b>${r.type}</b><br>${r.location_name}<br>Status: ${r.status}`);
    // });

    return reports;
  } catch (err) {
    console.error('Failed to load reports:', err);
  }
}

// Call on page load
// window.addEventListener('DOMContentLoaded', loadReports);
