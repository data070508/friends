/* ========================================
   MEMORY UNIVERSE V2.0
   MEDIA RENDERING ENGINE
======================================== */


/* =========================
   MAIN RENDER FUNCTION
========================= */

function renderApp() {

    renderLatestMedia();

    renderPhotos();

    renderVideos();

    renderAudio();

    renderFriends();

    renderStories();

}


/* =========================
   HOME - LATEST MEMORIES
========================= */

function renderLatestMedia() {

    const container =
        document.getElementById("latest-media");


    container.innerHTML = "";


    const latest = [
        ...APP_STATE.photos,
        ...APP_STATE.videos
    ]
    .slice(0, CONFIG.gallery.latestLimit);


    latest.forEach(item => {

        container.innerHTML += `
        
        <div class="media-card"
             onclick="openViewer(
             '${item.type}',
             '${item.url}')">

            ${
                item.type === "image"
                ?
                `<img src="${item.url}">`
                :
                `<video src="${item.url}"></video>`
            }

            <div class="media-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${item.category}
                </p>

            </div>

        </div>
        
        `;

    });

}


/* =========================
   PHOTO ALBUMS
========================= */

function renderPhotos() {

    const container =
        document.getElementById("photo-albums");


    container.innerHTML = "";


    const albums = groupByCategory(
        APP_STATE.photos
    );


    for (let album in albums) {


        const first =
            albums[album][0];


        container.innerHTML += `

        <div class="album-card"
             onclick="showAlbum('${album}')">

            <img src="${first.url}">

            <div class="media-info">

                <h3>
                    📁 ${album}
                </h3>

                <p>
                    ${albums[album].length}
                    Photos
                </p>

            </div>

        </div>

        `;

    }

}


/* =========================
   VIDEO ALBUMS
========================= */

function renderVideos() {


    const container =
        document.getElementById("video-albums");


    container.innerHTML = "";


    const albums =
        groupByCategory(
            APP_STATE.videos
        );


    for (let album in albums) {


        const video =
            albums[album][0];


        container.innerHTML += `

        <div class="album-card">

            <video 
              src="${video.url}"
              controls>
            </video>


            <div class="media-info">

                <h3>
                    🎥 ${album}
                </h3>


                <p>
                    ${albums[album].length}
                    Videos
                </p>

            </div>

        </div>

        `;

    }

}


/* =========================
   AUDIO LIST
========================= */

function renderAudio() {


    const container =
        document.getElementById("audio-list");


    container.innerHTML = "";


    APP_STATE.audio.forEach(audio => {


        container.innerHTML += `

        <div class="audio-card">


            <h3>
                🎵 ${audio.name}
            </h3>


            <p>
                ${audio.category}
            </p>


            <audio controls>

                <source 
                src="${audio.url}">

            </audio>


        </div>

        `;

    });

}


/* =========================
   FRIENDS WALL
========================= */

function renderFriends() {


    const container =
        document.getElementById("friends-list");


    container.innerHTML = "";


    APP_STATE.friends.forEach(friend => {


        container.innerHTML += `

        <div class="friend-card">


            <img src="${friend.photo}">


            <h3>
                ${friend.name}
            </h3>


            <p>
                ${friend.quote}
            </p>


        </div>

        `;

    });

}


/* =========================
   STORIES
========================= */

function renderStories() {


    const container =
        document.getElementById("stories-list");


    container.innerHTML = "";


    APP_STATE.stories.forEach(story => {


        container.innerHTML += `

        <div class="story-card">


            <h3>
                📖 ${story.title}
            </h3>


            <p>
                ${story.story}
            </p>


            <small>
                ${story.date}
            </small>


        </div>

        `;

    });

}


/* =========================
   FULL SCREEN VIEWER
========================= */

function openViewer(type, url) {


    const viewer =
        document.getElementById("viewer");


    const content =
        document.getElementById("viewer-content");


    content.innerHTML = "";


    if (type === "image") {


        content.innerHTML =
        `<img src="${url}">`;

    }


    if (type === "video") {


        content.innerHTML =
        `
        <video
            src="${url}"
            controls
            autoplay>
        </video>
        `;

    }


    viewer.style.display = "flex";

}


/* Close viewer */

document
.getElementById("close-viewer")
.addEventListener(
"click",
function() {


document
.getElementById("viewer")
.style.display = "none";


});


/* =========================
   HELPER FUNCTIONS
========================= */


function groupByCategory(items) {


    const groups = {};


    items.forEach(item => {


        if (!groups[item.category]) {


            groups[item.category] = [];

        }


        groups[item.category]
            .push(item);


    });


    return groups;

}


/* =========================
   ALBUM VIEW (Coming Soon)
========================= */


function showAlbum(name) {


    alert(
      "Album viewer for: " +
      name +
      "\n\nPart 8 will add a full gallery viewer."
    );

}
