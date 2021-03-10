var CACHE_NAME = 'usersCacheV1'; // {1}

var CACHE_FILES = [ // {2}
    'js/index.js',
    'index.html',
    'css/style.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CACHE_FILES)
            })
            .then(() => self.skipWaiting())
    )
});