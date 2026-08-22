let generatedOTP = null;


// GENERATE OTP
function generateOTP() {

    const mobile = document.getElementById("mobile").value;

    // Check mobile number
    if (mobile.length !== 10 || isNaN(mobile)) {

        alert("Please enter a valid 10-digit mobile number.");

        return;
    }


    // Generate 6 digit OTP
    generatedOTP = Math.floor(
        100000 + Math.random() * 900000
    );


    console.log("Generated OTP:", generatedOTP);


    // Show OTP section
    document.getElementById("otp-section").style.display = "block";


    // Message
    document.getElementById("otp-message").innerText =
        "OTP generated successfully. Check your SMS.";


    // Demo: OTP is also logged to the browser console.
    // Open DevTools (F12) → Console to view it.
}


// VERIFY OTP
function verifyOTP() {

    const enteredOTP =
        document.getElementById("otp").value;


    if (enteredOTP === "") {

        alert("Please enter the OTP.");

        return;
    }


    if (enteredOTP == generatedOTP) {

        alert("Login successful!");

        window.location.href = "dashboard.html";

    } else {

        alert("Incorrect OTP. Please try again.");

    }
}