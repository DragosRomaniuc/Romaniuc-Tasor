importScripts('serviceworker-cache-polyfill.js');
var CACHE_VERSION = 1;
var CURRENT_CACHES = {
    categories: 'categories-cache' + CACHE_VERSION
};
var urlsToCache = [
    '/account',
    '/categories',
    '/'
];

// self.addEventListener('install', function(event) {
//     // Perform install steps
//     event.waitUntil(
//         caches.open(CURRENT_CACHES['categories'])
//             .then(function(cache) {
//                 console.log('Opened cache');
//                 return cache.addAll(urlsToCache);
//             })
//     );
// });
self.addEventListener('activate', function(event) {
    var expectedCacheNames = Object.values(CURRENT_CACHES);

    // Active worker won't be treated as activated until promise
    // resolves successfully.
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (!expectedCacheNames.includes(cacheName)) {
                        console.log('Deleting out of date cache:', cacheName);

                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('Handling fetch event for', event.request);

    event.respondWith(
        // Opens Cache objects that start with 'categories'.
        caches.open(CURRENT_CACHES['categories']).then(function(cache) {

            if(self.navigator.onLine) {
               console.log(event.request.url,'din navigator');
            }


            if(event.request.method === "POST" || event.request.method === "DELETE") {
                return fetch(event.request).then(async function(networkResponse) {
                    let urlToFetchAndCache = null;
                    switch (event.request.method) {
                        case 'POST':
                            urlToFetchAndCache = event.request.url.replace('/new','');
                            break;
                        case 'DELETE':
                            urlToFetchAndCache = event.request.url.replace('/delete','');
                           break;
                        case 'PUT':
                            urlToFetchAndCache = event.request.url.replace('/put','');
                            break;
                    }
                    await fetch(urlToFetchAndCache, {
                        method: 'GET',
                        mode: 'cors'
                    }).then(networkResponse2 => {
                        cache.put(urlToFetchAndCache, networkResponse2.clone())
                    });
                    return networkResponse;
                });
            }
            // if(event.request.method === "POST" || event.request.method === "DELETE") {
            //     if(event.request.url.endsWith('categories/new') || event.request.url.endsWith('todos/new')) {
            //         let urlToCacheAndFetch = event.request.url.replace('/new','');
            //         return fetch(event.request).then(function(networkResponse) {
            //             console.log('NEW CACHE TO: ', urlToCacheAndFetch);
            //             console.log('network response is:', networkResponse)
            //             cache.put(urlToCacheAndFetch, networkResponse.clone());
            //             return networkResponse;
            //         });
            //     }
            // }

            return cache.match(event.request.url).then(function(response) {
                if (response) {
                    console.log('Found response in cache:', response);

                    return response;
                }

                console.log('Fetching request from the network');

                return fetch(event.request).then(function(networkResponse) {
                    cache.put(event.request.url, networkResponse.clone());

                    return networkResponse;
                });
            }).catch(function(error) {

                // Handles exceptions that arise from match() or fetch().
                console.error('Error in fetch handler:', error);

                throw error;
            });
        })
    );
});


self.addEventListener('fetch', (event) => {
    // Clone the request to ensure it's safe to read when
    // adding to the Queue.
    if(!self.navigator.onLine) {
        const promise = fetch(event.request.clone());
        event.waitUntil(promiseChain);
    }


    console.log('am ajuns in fetch queue')

});