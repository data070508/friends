/* ========================================
   MEMORY UNIVERSE V2.0 CONFIGURATION
   ======================================== */

const CONFIG = {

    /* ================================
       GitHub Repository Settings
    ================================= */

    github: {

        // Your GitHub username
        username: "YOUR_GITHUB_USERNAME",

        // Repository containing memories
        repository: "memory-universe",

        // Repository branch
        branch: "main",

        // Repository folders
        paths: {

            photos: "assets/photos",

            videos: "assets/videos",

            audio: "assets/audio",

            friends: "data/friends.json",

            stories: "data/stories.json",

            timeline: "data/timeline.json"

        }

    },


    /* ================================
       GitHub API
    ================================= */

    api: {

        // Base GitHub REST API URL
        baseURL: "https://api.github.com/repos",

        // Auto refresh media list
        autoRefresh: true,

        // Refresh every 5 minutes
        refreshInterval: 300000,

        // Maximum API retries
        retries: 3,

        // Delay between retries
        retryDelay: 2000

    },


    /* ================================
       Supported Media Formats
    ================================= */

    media: {

        images: [

            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
            "avif",
            "svg"

        ],


        videos: [

            "mp4",
            "webm",
            "mov",
            "m4v"

        ],


        audio: [

            "mp3",
            "wav",
            "ogg",
            "m4a"

        ]

    },


    /* ================================
       Application Settings
    ================================= */

    app: {

        name: "Memory Universe ❤️",

        version: "2.0.0",

        mobileOnly: true,

        darkMode: true,

        animations: true,

        showSplash: true,

        splashDuration: 2000

    },


    /* ================================
       Gallery Settings
    ================================= */

    gallery: {

        // Number of latest memories
        latestLimit: 10,

        // Photos per row
        columns: 2,

        // Enable slideshow
        slideshow: true,

        // Slideshow speed in milliseconds
        slideshowSpeed: 3000,

        // Enable pinch zoom
        zoomEnabled: true

    },


    /* ================================
       Cache Settings
    ================================= */

    cache: {

        enabled: true,

        // Cache lifetime: 1 hour
        expiration: 3600000,

        key: "memory-universe-cache"

    },


    /* ================================
       Friendship Counter
    ================================= */

    friendship: {

        startDate: "2020-06-15"

    },


    /* ================================
       Search Settings
    ================================= */

    search: {

        enabled: true,

        minCharacters: 2,

        maxResults: 50,

        include: [

            "photos",

            "videos",

            "audio",

            "stories",

            "friends"

        ]

    },


    /* ================================
       Security Settings
    ================================= */

    security: {

        // Public GitHub repositories
        // do not need authentication
        useToken: false,

        token: ""

    },


    /* ================================
       Debug Mode
    ================================= */

    debug: {

        enabled: true,

        showAPICalls: true,

        showErrors: true

    }

};


/* ========================================
   HELPER VARIABLES
   ======================================== */


const GITHUB_API =
    `${CONFIG.api.baseURL}/` +
    `${CONFIG.github.username}/` +
    `${CONFIG.github.repository}`;


/*
Example generated URL:

https://api.github.com/repos/
YOUR_USERNAME/
memory-universe

*/


const RAW_GITHUB =
    `https://raw.githubusercontent.com/` +
    `${CONFIG.github.username}/` +
    `${CONFIG.github.repository}/` +
    `${CONFIG.github.branch}`;



/*
Example:

https://raw.githubusercontent.com/
YOUR_USERNAME/
memory-universe/main/assets/photos/goa.jpg

*/


/* ========================================
   APPLICATION STATE
   ======================================== */

const APP_STATE = {

    photos: [],

    videos: [],

    audio: [],

    friends: [],

    stories: [],

    timeline: [],


    stats: {

        photos: 0,

        videos: 0,

        audio: 0

    },


    loaded: false,

    lastSync: null

};


/* ========================================
   LOGGING SYSTEM
   ======================================== */

function log(message, data = null) {

    if (!CONFIG.debug.enabled)
        return;


    console.log(
        "❤️ Memory Universe:",
        message,
        data || ""
    );

}



function error(message, data = null) {

    if (!CONFIG.debug.showErrors)
        return;


    console.error(
        "❌ Memory Universe:",
        message,
        data || ""
    );

}
