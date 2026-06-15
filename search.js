/* ========================================
   MEMORY UNIVERSE V2.0
   SMART SEARCH ENGINE
======================================== */


/* =========================
   SEARCH CONFIG
========================= */

const SEARCH_STORAGE =
    "memory-universe-search-history";


let searchHistory = [];


/* =========================
   INITIALIZE SEARCH
========================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeSearch
);


function initializeSearch() {


    const input =
        document.getElementById(
            "search-input"
        );


    if (!input) return;


    loadSearchHistory();


    input.addEventListener(
        "input",
        function () {


            const query =
                this.value
                .trim()
                .toLowerCase();


            if (
                query.length <
                CONFIG.search.minCharacters
            ) {


                showSearchHistory();


                return;

            }


            performSearch(query);


        }
    );


    showSearchHistory();

}


/* =========================
   MAIN SEARCH
========================= */

function performSearch(query) {


    let results = [];


    // Photos
    APP_STATE.photos.forEach(item => {


        if (
            matches(
                item.name,
                query
            ) ||
            matches(
                item.category,
                query
            )
        ) {


            results.push({
                type: "📸 Photo",
                data: item
            });

        }

    });


    // Videos
    APP_STATE.videos.forEach(item => {


        if (
            matches(item.name, query) ||
            matches(item.category, query)
        ) {


            results.push({
                type: "🎥 Video",
                data: item
            });

        }

    });


    // Audio
    APP_STATE.audio.forEach(item => {


        if (
            matches(item.name, query) ||
            matches(item.category, query)
        ) {


            results.push({
                type: "🎵 Audio",
                data: item
            });

        }

    });


    // Friends
    APP_STATE.friends.forEach(friend => {


        if (
            matches(friend.name, query) ||
            matches(friend.quote, query)
        ) {


            results.push({
                type: "👤 Friend",
                data: friend
            });

        }

    });


    // Stories
    APP_STATE.stories.forEach(story => {


        if (
            matches(story.title, query) ||
            matches(story.story, query)
        ) {


            results.push({
                type: "📖 Story",
                data: story
            });

        }

    });


    results =
        results.slice(
            0,
            CONFIG.search.maxResults
        );


    saveSearch(query);


    displayResults(results);

}


/* =========================
   DISPLAY RESULTS
========================= */

function displayResults(results) {


    const container =
        document.getElementById(
            "search-results"
        );


    container.innerHTML = "";


    if (results.length === 0) {


        container.innerHTML = `
            <div class="story-card">
                <h3>😢 No Memories Found</h3>

                <p>
                    Try another word
                </p>
            </div>
        `;


        return;

    }


    results.forEach(result => {


        const item =
            result.data;


        let card = "";


        if (
            result.type.includes("Photo")
        ) {


            card = `
            <div class="media-card"
                 onclick="openViewer(
                 'image',
                 '${item.url}')">

                <img src="${item.url}">

                <div class="media-info">

                    <h3>${item.name}</h3>

                    <p>
                        ${result.type}
                        • ${item.category}
                    </p>

                </div>

            </div>
            `;

        }


        else if (
            result.type.includes("Video")
        ) {


            card = `
            <div class="media-card"
                 onclick="openViewer(
                 'video',
                 '${item.url}')">

                <video src="${item.url}">
                </video>


                <div class="media-info">

                    <h3>${item.name}</h3>

                    <p>
                        ${result.type}
                    </p>

                </div>

            </div>
            `;

        }


        else if (
            result.type.includes("Audio")
        ) {


            card = `
            <div class="audio-card">

                <h3>
                    ${item.name}
                </h3>


                <audio controls>

                    <source
                    src="${item.url}">

                </audio>

            </div>
            `;

        }


        else if (
            result.type.includes("Friend")
        ) {


            card = `
            <div class="friend-card">


                <img src="${item.photo}">


                <h3>
                    ${item.name}
                </h3>


                <p>
                    ${item.quote}
                </p>


            </div>
            `;

        }


        else {


            card = `
            <div class="story-card">

                <h3>
                    ${item.title}
                </h3>


                <p>
                    ${item.story}
                </p>


            </div>
            `;

        }


        container.innerHTML += card;


    });

}


/* =========================
   MATCH HELPER
========================= */

function matches(text, query) {


    return (
        text &&
        text
        .toLowerCase()
        .includes(query)
    );

}


/* =========================
   SEARCH HISTORY
========================= */

function saveSearch(query) {


    if (
        searchHistory.includes(query)
    )
        return;


    searchHistory.unshift(query);


    searchHistory =
        searchHistory.slice(0, 10);


    localStorage.setItem(
        SEARCH_STORAGE,
        JSON.stringify(searchHistory)
    );

}


function loadSearchHistory() {


    const data =
        localStorage.getItem(
            SEARCH_STORAGE
        );


    if (data) {


        searchHistory =
            JSON.parse(data);

    }

}


/* =========================
   SHOW RECENT SEARCHES
========================= */

function showSearchHistory() {


    const container =
        document.getElementById(
            "search-results"
        );


    if (
        searchHistory.length === 0
    ) {


        container.innerHTML = `
        <div class="story-card">

            <h3>
                🔍 Search Memories
            </h3>


            <p>
                Find photos,
                videos, friends,
                and stories.
            </p>

        </div>
        `;


        return;

    }


    let html = `
        <div class="story-card">

        <h3>
        🕒 Recent Searches
        </h3>
    `;


    searchHistory.forEach(query => {


        html += `

        <p 
        onclick="selectSearch(
        '${query}')">

        🔎 ${query}

        </p>

        `;


    });


    html += "</div>";


    container.innerHTML = html;

}


/* =========================
   CLICK HISTORY ITEM
========================= */

function selectSearch(query) {


    const input =
        document.getElementById(
            "search-input"
        );


    input.value = query;


    performSearch(query);

}
