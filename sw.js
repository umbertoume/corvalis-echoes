"use strict";

const CACHE_NAME = "corvali-echoes-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./game.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


/* =========================
   INSTALL
   ========================= */

self.addEventListener("install", function (event) {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(function (cache) {

                return cache.addAll(FILES_TO_CACHE);

            })

    );

    self.skipWaiting();
});


/* =========================
   ACTIVATE
   ========================= */

self.addEventListener("activate", function (event) {

    event.waitUntil(

        caches.keys()
            .then(function (cacheNames) {

                return Promise.all(

                    cacheNames
                        .filter(function (cacheName) {

                            return cacheName !== CACHE_NAME;

                        })
                        .map(function (cacheName) {

                            return caches.delete(cacheName);

                        })

                );

            })

    );

    self.clients.claim();
});


/* =========================
   FETCH
   ========================= */

self.addEventListener("fetch", function (event) {

    event.respondWith(

        caches.match(event.request)
            .then(function (cachedResponse) {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);

            })

    );

});