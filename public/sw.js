// importScripts('serviceworker-cache-polyfill.js');
(function() {
    if (!window.Cache) return;
    var nativeAddAll = Cache.prototype.addAll;
    var userAgent = navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);

    // Has nice behavior of `var` which everyone hates
    if (userAgent) {
        var agent = userAgent[1];
        var version = parseInt(userAgent[2]);
    }

    if (
        nativeAddAll && (!userAgent ||
            (agent === 'Firefox' && version >= 46) ||
            (agent === 'Chrome'  && version >= 50)
        )
    ) {
        return;
    }

    Cache.prototype.addAll = function addAll(requests) {
        var cache = this;

        // Since DOMExceptions are not constructable:
        function NetworkError(message) {
            this.name = 'NetworkError';
            this.code = 19;
            this.message = message;
        }

        NetworkError.prototype = Object.create(Error.prototype);

        return Promise.resolve().then(function() {
            if (arguments.length < 1) throw new TypeError();

            // Simulate sequence<(Request or USVString)> binding:
            var sequence = [];

            requests = requests.map(function(request) {
                if (request instanceof Request) {
                    return request;
                }
                else {
                    return String(request); // may throw TypeError
                }
            });

            return Promise.all(
                requests.map(function(request) {
                    if (typeof request === 'string') {
                        request = new Request(request);
                    }

                    var scheme = new URL(request.url).protocol;

                    if (scheme !== 'http:' && scheme !== 'https:') {
                        throw new NetworkError("Invalid scheme");
                    }

                    return fetch(request.clone());
                })
            );
        }).then(function(responses) {
            // If some of the responses has not OK-eish status,
            // then whole operation should reject
            if (responses.some(function(response) {
                return !response.ok;
            })) {
                throw new NetworkError('Incorrect response status');
            }

            // TODO: check that requests don't overwrite one another
            // (don't think this is possible to polyfill due to opaque responses)
            return Promise.all(
                responses.map(function(response, i) {
                    return cache.put(requests[i], response);
                })
            );
        }).then(function() {
            return undefined;
        });
    };

    Cache.prototype.add = function add(request) {
        return this.addAll([request]);
    };
}());
var CACHE_VERSION = 1;
var CURRENT_CACHES = {
    categories: 'categories-cache' + CACHE_VERSION
};
var urlsToCache = [
    '/account',
    '/categories',
    '/'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CURRENT_CACHES['categories'])
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

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

self.addEventListener('fetch', async function(event) {
    console.log('Handling fetch event for', event.request);

    event.respondWith(
        // Opens Cache objects that start with 'categories'.
        caches.open(CURRENT_CACHES['categories']).then(function(cache) {

            if(self.navigator.onLine) {
                console.log(event.request.url,'din navigator');
            }


            if(['POST','PUT','DELETE'].includes(event.request.method) && self.navigator.onLine) {
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
                            urlToFetchAndCache = event.request.url.replace('/edit','');
                            let pieces = urlToFetchAndCache.split('/');
                            switch (pieces[pieces.length - 2]) {
                                case 'categories':
                                    await fetch('http://' + pieces[2] +'/categories', {
                                        method: 'GET',
                                        mode: 'cors'
                                    }).then(networkResponse2 => {
                                        cache.put('http://' + pieces[2] +'/categories', networkResponse2.clone())
                                    });
                                    break;
                                case 'todos':
                                    await fetch('http://' + pieces[2] +'/categories' + pieces[pieces.length - 3] + '/todos', {
                                        method: 'GET',
                                        mode: 'cors'
                                    }).then(networkResponse2 => {
                                        cache.put('http://' + pieces[2] +'/categories' + pieces[pieces.length - 3] + '/todos', networkResponse2.clone())
                                    });
                                    break;
                            }
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

            return cache.match(event.request.url).then(async function(response) {
                if (response) {
                    console.log('Found response in cache:', response);

                    return response;
                }

                console.log('Fetching request from the network');
                if(self.navigator.onLine) {
                    return fetch(event.request).then(function(networkResponse) {
                        cache.put(event.request.url, networkResponse.clone());

                        return networkResponse;
                    });
                } else {
                    return await cache.match(event.request.referrer);
                }

            }).catch(function(error) {

                console.error('Error in fetch handler:', error);

                throw error;
            });
        })
    );
});


// self.addEventListener('fetch', (event) => {
//     // Clone the request to ensure it's safe to read when
//     // adding to the Queue.
//     if(!self.navigator.onLine) {
//         const promise = fetch(event.request.clone());
//         event.waitUntil(promiseChain);
//     }
//
//
//     console.log('am ajuns in fetch queue')
//
// });