const AUTH_API = "http://localhost:5000/api/auth";

let currentEmail = "";


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


async function generateOTP() {

    const email =
        document.getElementById("email").value.trim().toLowerCase();

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const button = document.getElementById("otp-btn");

    button.disabled = true;
    button.innerText = "Sending...";

    try {

        const response = await fetch(AUTH_API + "/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not send OTP.");
        }

        currentEmail = email;

        document.getElementById("otp-section").style.display = "block";

        document.getElementById("otp-message").innerText =
            "OTP sent to " + email + ". It is valid for 5 minutes.";

    } catch (error) {

        if (error instanceof TypeError) {
            alert("Could not reach the server. Is the backend running?");
        } else {
            alert(error.message);
        }

    } finally {

        button.disabled = false;
        button.innerText = "Generate OTP";
    }
}


async function verifyOTP() {

    const enteredOTP =
        document.getElementById("otp").value.trim();

    if (enteredOTP === "") {
        alert("Please enter the OTP.");
        return;
    }

    const email =
        currentEmail ||
        document.getElementById("email").value.trim().toLowerCase();

    try {

        const response = await fetch(AUTH_API + "/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, otp: enteredOTP })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Verification failed.");
        }

        localStorage.setItem("citizenEmail", email);
        localStorage.setItem("loginEmail", email);

        alert("Login successful!");
        window.location.href = "dashboard.html";

    } catch (error) {

        if (error instanceof TypeError) {
            alert("Could not reach the server. Is the backend running?");
        } else {
            alert(error.message);
        }
    }
}