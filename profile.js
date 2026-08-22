document.addEventListener("DOMContentLoaded", () => {

    /* ================= ELEMENTS ================= */

    const editProfileBtn =
        document.getElementById("editProfileBtn");

    const personalEdit =
        document.getElementById("personalEdit");

    const modalOverlay =
        document.getElementById("modalOverlay");

    const closeModal =
        document.getElementById("closeModal");

    const cancelBtn =
        document.getElementById("cancelBtn");

    const profileForm =
        document.getElementById("profileForm");

    const photoInput =
        document.getElementById("photoInput");

    const profilePhoto =
        document.getElementById("profilePhoto");

    const profileInitial =
        document.getElementById("profileInitial");

    const profileName =
        document.getElementById("profileName");

    const infoName =
        document.getElementById("infoName");

    const sidebarName =
        document.getElementById("sidebarName");

    const topName =
        document.getElementById("topName");

    const profileLocation =
        document.getElementById("profileLocation");

    const infoLocation =
        document.getElementById("infoLocation");

    const nameInput =
        document.getElementById("nameInput");

    const cityInput =
        document.getElementById("cityInput");

    const sidebarAvatar =
        document.getElementById("sidebarAvatar");

    const topAvatar =
        document.getElementById("topAvatar");

    const toast =
        document.getElementById("toast");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const sidebar =
        document.querySelector(".sidebar");


    /* ================= LOCAL STORAGE ================= */

    let savedName =
        localStorage.getItem("citizenName") ||
        "Citizen User";

    let savedCity =
        localStorage.getItem("citizenCity") ||
        "Nagpur";


    /* ================= LOAD PROFILE ================= */

    updateProfile(savedName, savedCity);


    /* ================= MODAL ================= */

    function openModal() {

        nameInput.value = savedName;

        cityInput.value = savedCity;

        modalOverlay.classList.add("show");

        nameInput.focus();
    }


    function closeProfileModal() {

        modalOverlay.classList.remove("show");

    }


    editProfileBtn.addEventListener(
        "click",
        openModal
    );


    personalEdit.addEventListener(
        "click",
        openModal
    );


    closeModal.addEventListener(
        "click",
        closeProfileModal
    );


    cancelBtn.addEventListener(
        "click",
        closeProfileModal
    );


    modalOverlay.addEventListener(
        "click",
        (event) => {

            if (event.target === modalOverlay) {

                closeProfileModal();

            }

        }
    );


    /* ================= SAVE PROFILE ================= */

    profileForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const newName =
                nameInput.value.trim();

            const newCity =
                cityInput.value.trim();


            if (!newName || !newCity) {

                showToast(
                    "Please fill all required fields."
                );

                return;

            }


            savedName = newName;

            savedCity = newCity;


            localStorage.setItem(
                "citizenName",
                savedName
            );

            localStorage.setItem(
                "citizenCity",
                savedCity
            );


            updateProfile(
                savedName,
                savedCity
            );


            closeProfileModal();

            showToast(
                "Profile updated successfully!"
            );

        }
    );


    /* ================= UPDATE UI ================= */

    function updateProfile(name, city) {

        profileName.textContent = name;

        infoName.textContent = name;

        sidebarName.textContent = name;

        topName.textContent = name;

        infoLocation.textContent = city;

        profileLocation.innerHTML =
            `<i class="fa-solid fa-location-dot"></i>
             ${city}, Maharashtra`;


        const initial =
            name.charAt(0).toUpperCase();


        profileInitial.textContent =
            initial;


        sidebarAvatar.textContent =
            initial;


        topAvatar.textContent =
            initial;

    }


    /* ================= PROFILE PHOTO ================= */

    photoInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            if (!file) return;


            if (!file.type.startsWith("image/")) {

                showToast(
                    "Please select an image file."
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload = function(e) {

                const image =
                    document.createElement("img");

                image.src =
                    e.target.result;


                profilePhoto.innerHTML = "";

                profilePhoto.appendChild(image);


                const sidebarImage =
                    document.createElement("img");

                sidebarImage.src =
                    e.target.result;


                sidebarAvatar.innerHTML = "";

                sidebarAvatar.appendChild(
                    sidebarImage
                );


                const topImage =
                    document.createElement("img");

                topImage.src =
                    e.target.result;


                topAvatar.innerHTML = "";

                topAvatar.appendChild(
                    topImage
                );


                localStorage.setItem(
                    "citizenPhoto",
                    e.target.result
                );


                showToast(
                    "Profile photo updated!"
                );

            };


            reader.readAsDataURL(file);

        }
    );


    /* ================= LOAD SAVED PHOTO ================= */

    const savedPhoto =
        localStorage.getItem(
            "citizenPhoto"
        );


    if (savedPhoto) {

        const image =
            document.createElement("img");

        image.src =
            savedPhoto;

        profilePhoto.innerHTML = "";

        profilePhoto.appendChild(image);


        const sidebarImage =
            document.createElement("img");

        sidebarImage.src =
            savedPhoto;

        sidebarAvatar.innerHTML = "";

        sidebarAvatar.appendChild(
            sidebarImage
        );


        const topImage =
            document.createElement("img");

        topImage.src =
            savedPhoto;

        topAvatar.innerHTML = "";

        topAvatar.appendChild(
            topImage
        );

    }


    /* ================= TOAST ================= */

    function showToast(message) {

        toast.querySelector("span")
            .textContent = message;

        toast.classList.add("show");


        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

    }


    /* ================= MOBILE SIDEBAR ================= */

    mobileMenu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    /* ================= LOGOUT ================= */

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                window.location.href =
                    "login.html";

            }

        }
    );


    /* ================= DASHBOARD NAVIGATION ================= */

    const dashboardLink =
        document.querySelector(
            '.sidebar-nav a[href="dashboard.html"]'
        );


    if (dashboardLink) {

        dashboardLink.addEventListener(
            "click",
            () => {

                window.location.href =
                    "dashboard.html";

            }
        );

    }


    /* ================= ANIMATIONS ================= */

    const cards =
        document.querySelectorAll(
            ".card, .stat-card"
        );


    cards.forEach(
        (card, index) => {

            card.style.opacity = "0";

            card.style.transform =
                "translateY(10px)";


            setTimeout(() => {

                card.style.transition =
                    "all .45s ease";

                card.style.opacity = "1";

                card.style.transform =
                    "translateY(0)";

            }, index * 70);

        }
    );

});