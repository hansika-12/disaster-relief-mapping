// Show logo/splash screen for 2.5 seconds, then redirect to login page
window.addEventListener("load", function () {

    setTimeout(function () {

        const splash = document.getElementById("splash-screen");

        splash.classList.add("hide-splash");

        // Redirect to login page after fade-out
        setTimeout(function () {
            window.location.href = "login.html";
        }, 800);

    }, 2500);

});