"use strict";

const CACHE_NAME = "corvali-echoes-v5";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./game.js",
    "./i18n.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png",
    "./icon-maskable-512.png",
    "./apple-touch-icon.png"
];


/* INSTALL: cache what exists, never fail because one file is missing */

self.addEventListener("install", function (event) {

    event.waitUntil(

        caches.open(CACHE_NAME).then(function (cache) {

            return Promise.all(
                FILES_TO_CACHE.map(function (url) {
                    return cache.add(url).catch(function () {
                        return null;
                    });
                })
            );
        })
    );

    self.skipWaiting();
});


/* ACTIVATE: remove old caches */

self.addEventListener("activate", function (event) {

    event.waitUntil(

        caches.keys().then(function (names) {

            return Promise.all(
                names
                    .filter(function (name) {
                        return name !== CACHE_NAME;
                    })
                    .map(function (name) {
                        return caches.delete(name);
                    })
            );
        })
    );

    self.clients.claim();
});


/* FETCH: network first (updates arrive immediately), cache as offline fallback.
   Audio is left to the browser: cached responses break Range requests on Safari. */

self.addEventListener("fetch", function (event) {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (request.headers.has("range") || /\.(mp3|ogg|wav)$/i.test(url.pathname)) {
        return;
    }

    event.respondWith(

        fetch(request)
            .then(function (response) {

                if (response && response.status === 200 && response.type === "basic") {

                    const copy = response.clone();

                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(request, copy);
                    });
                }

                return response;
            })
            .catch(function () {

                return caches.match(request).then(function (cached) {
                    return cached || caches.match("./index.html");
                });
            })
    );
});
