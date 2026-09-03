let generatedOTP = null;

function generateOTP() {
    const mobile = document.getElementById("mobile").value;
    if (mobile.length !== 10 || isNaN(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }
    generatedOTP = Math.floor(
        100000 + Math.random() * 900000
    );
    console.log("Generated OTP:", generatedOTP);
    document.getElementById("otp-section").style.display = "block";
    document.getElementById("otp-message").innerText =
        "OTP generated successfully. Check your SMS.";
}

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