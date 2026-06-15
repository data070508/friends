/* ========================================
   MEMORY UNIVERSE V2.0
   MAIN APPLICATION ENGINE
======================================== */


/* =========================
   DOM ELEMENTS
========================= */

const splash = document.getElementById("splash");
const app = document.getElementById("app");

const pages = document.querySelectorAll(".page");

const navButtons =
    document.querySelectorAll("#bottom-nav button");

const refreshButton =
    document.getElementById("refresh-btn");

const friendshipCounter =
    document.getElementById("friend-days");


/* =========================
   APPLICATION START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


async function initializeApp() {

    log("Application starting");


    try {

        // Show splash screen
        await delay(
            CONFIG.app.splashDuration
        );


        // Update friendship days
        updateFriendshipCounter();


        // Load GitHub data
        await syncRepository();


        // Enable navigation
        initializeNavigation();


        // Enable refresh button
        initializeRefresh();


        // Start auto updates
        startAutoRefresh();


        // Show application
        showApplication();


        log("Application ready");


    } catch (err) {

        error(
            "Startup failed",
            err
        );

        showError(
            "Failed to load memories"
        );
    }

}


/* =========================
   SPLASH HANDLING
========================= */

function showApplication() {

    splash.style.display = "none";

    app.style.display = "block";

}


/* =========================
   NAVIGATION SYSTEM
========================= */

function initializeNavigation() {


    navButtons.forEach(button => {


        button.addEventListener(
            "click",
            () => {


                const page =
                    button.dataset.page;


                openPage(page);


            }
        );


    });


}


function openPage(pageId) {


    pages.forEach(page => {


        page.classList.remove("active");


    });


    navButtons.forEach(button => {


        button.classList.remove("active");


    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {


        selectedPage.classList.add(
            "active"
        );


    }


    const selectedButton =
        document.querySelector(
            `[data-page="${pageId}"]`
        );


    if (selectedButton) {


        selectedButton.classList.add(
            "active"
        );


    }


}


/* =========================
   FRIENDSHIP COUNTER
========================= */


function updateFriendshipCounter() {


    const start =
        new Date(
            CONFIG.friendship.startDate
        );


    const now = new Date();


    const difference =
        now - start;


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    friendshipCounter.textContent =
        days.toLocaleString();


}


/* =========================
   REFRESH SYSTEM
========================= */


function initializeRefresh() {


    refreshButton.addEventListener(
        "click",
        async () => {


            refreshButton.innerHTML = "⏳";


            try {


                await syncRepository();


                log(
                    "Manual refresh complete"
                );


            } catch (err) {


                error(
                    "Refresh failed",
                    err
                );


            }


            refreshButton.innerHTML = "🔄";


        }
    );


}


/* =========================
   AUTO REFRESH
========================= */


function startAutoRefresh() {


    if (
        !CONFIG.api.autoRefresh
    ) {
        return;
    }


    setInterval(
        async () => {


            log(
                "Automatic sync started"
            );


            try {


                await syncRepository();


            } catch (err) {


                error(
                    "Auto sync failed",
                    err
                );


            }


        },
        CONFIG.api.refreshInterval
    );


}


/* =========================
   STATISTICS
========================= */


function updateStatistics() {


    document.getElementById(
        "photo-count"
    ).textContent =
        APP_STATE.stats.photos;


    document.getElementById(
        "video-count"
    ).textContent =
        APP_STATE.stats.videos;


    document.getElementById(
        "audio-count"
    ).textContent =
        APP_STATE.stats.audio;


}


/* =========================
   LOADING SCREEN
========================= */


function showLoading(message) {


    log(
        "Loading:",
        message
    );


}


function hideLoading() {


    log(
        "Loading completed"
    );


}


/* =========================
   ERROR DISPLAY
========================= */


function showError(message) {


    splash.innerHTML = `

        <div style="
            text-align:center;
            padding:30px;
        ">

            <h2>
                ⚠️ Error
            </h2>

            <br>

            <p>
                ${message}
            </p>

            <br>

            <button onclick="location.reload()">

                Reload

            </button>

        </div>

    `;


}


/* =========================
   UTILITIES
========================= */


function delay(milliseconds) {


    return new Promise(
        resolve => {


            setTimeout(
                resolve,
                milliseconds
            );


        }
    );


}


/* =========================
   GLOBAL APP EVENTS
========================= */


window.addEventListener(
    "online",
    () => {


        log(
            "Internet connection restored"
        );


        syncRepository();


    }
);


window.addEventListener(
    "offline",
    () => {


        error(
            "No internet connection"
        );


    }
);


window.addEventListener(
    "visibilitychange",
    () => {


        if (
            !document.hidden
        ) {


            log(
                "User returned to app"
            );


        }


    }
);
