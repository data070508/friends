/* ========================================
   MEMORY UNIVERSE V2.0
   GITHUB REPOSITORY ENGINE
======================================== */


/* =========================
   MAIN REPOSITORY SYNC
========================= */

async function syncRepository() {

    log("Starting GitHub sync...");


    try {

        // Load media folders
        const photos = await scanFolder(
            CONFIG.github.paths.photos,
            "image"
        );

        const videos = await scanFolder(
            CONFIG.github.paths.videos,
            "video"
        );

        const audio = await scanFolder(
            CONFIG.github.paths.audio,
            "audio"
        );


        // Load JSON data
        const friends = await loadJSON(
            CONFIG.github.paths.friends
        );

        const stories = await loadJSON(
            CONFIG.github.paths.stories
        );

        const timeline = await loadJSON(
            CONFIG.github.paths.timeline
        );


        // Update memory database
        APP_STATE.photos = photos;
        APP_STATE.videos = videos;
        APP_STATE.audio = audio;

        APP_STATE.friends = friends || [];
        APP_STATE.stories = stories || [];
        APP_STATE.timeline = timeline || [];


        // Update statistics
        APP_STATE.stats.photos =
            photos.length;

        APP_STATE.stats.videos =
            videos.length;

        APP_STATE.stats.audio =
            audio.length;


        APP_STATE.lastSync =
            new Date();


        APP_STATE.loaded = true;


        // Save offline cache
        saveCache();


        // Update UI
        if (typeof renderApp === "function") {
            renderApp();
        }


        updateStatistics();


        log(
            "GitHub sync completed",
            APP_STATE
        );


    } catch (err) {

        error(
            "Sync failed",
            err
        );

        loadCache();

    }

}


/* =========================
   SCAN GITHUB FOLDER
========================= */

async function scanFolder(path, type) {


    let files = [];


    const url =
        `${GITHUB_API}/contents/${path}`;


    log("Scanning:", url);


    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Cannot access " + path
        );

    }


    const items =
        await response.json();


    for (const item of items) {


        if (item.type === "dir") {


            // Recursive scan
            const nested =
                await scanFolder(
                    item.path,
                    type
                );


            files.push(...nested);

        }


        if (item.type === "file") {


            const extension =
                item.name
                .split(".")
                .pop()
                .toLowerCase();


            if (isSupported(
                extension,
                type
            )) {


                files.push({

                    name: item.name,

                    path: item.path,

                    url: item.download_url,

                    size: item.size,

                    category: getCategory(
                        item.path
                    ),

                    type: type,

                    uploaded:
                        item.sha

                });

            }

        }

    }


    return files;

}


/* =========================
   CHECK FILE TYPE
========================= */

function isSupported(
    extension,
    type
) {


    if (
        type === "image"
    ) {

        return CONFIG.media.images
            .includes(extension);

    }


    if (
        type === "video"
    ) {

        return CONFIG.media.videos
            .includes(extension);

    }


    if (
        type === "audio"
    ) {

        return CONFIG.media.audio
            .includes(extension);

    }


    return false;

}


/* =========================
   GET ALBUM NAME
========================= */

function getCategory(path) {


    const parts =
        path.split("/");


    /*
    assets/photos/goa/image.jpg

    returns:
    goa
    */


    return parts.length > 2
        ? parts[2]
        : "Other";

}


/* =========================
   LOAD JSON FILE
========================= */

async function loadJSON(path) {


    try {


        const url =
            `${RAW_GITHUB}/${path}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            return [];

        }


        return await response.json();


    } catch (err) {


        error(
            "JSON loading failed",
            err
        );


        return [];

    }

}


/* =========================
   CACHE SYSTEM
========================= */

function saveCache() {


    if (
        !CONFIG.cache.enabled
    ) {
        return;
    }


    const data = {

        timestamp:
            Date.now(),

        state:
            APP_STATE

    };


    localStorage.setItem(
        CONFIG.cache.key,
        JSON.stringify(data)
    );


    log("Cache saved");

}


/* =========================
   LOAD CACHE
========================= */

function loadCache() {


    try {


        const cache =
            localStorage.getItem(
                CONFIG.cache.key
            );


        if (!cache) {

            return false;

        }


        const data =
            JSON.parse(cache);


        const age =
            Date.now()
            -
            data.timestamp;


        if (
            age >
            CONFIG.cache.expiration
        ) {


            localStorage.removeItem(
                CONFIG.cache.key
            );


            return false;

        }


        Object.assign(
            APP_STATE,
            data.state
        );


        updateStatistics();


        if (
            typeof renderApp ===
            "function"
        ) {

            renderApp();

        }


        log(
            "Loaded from cache"
        );


        return true;


    } catch (err) {


        error(
            "Cache failed",
            err
        );


        return false;

    }

}
