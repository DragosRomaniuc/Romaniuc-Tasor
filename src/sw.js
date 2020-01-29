importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
//CUSTOM, AICI PUNEM CE VREM NOI ca sa modifice public/sw.js
const queue = new workbox.backgroundSync.Queue('myNetworkQueue');
// Cache image files.
workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);

workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    // Use the cache if it's available.
    new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                // Cache only 20 images.
                maxEntries: 20,
                // Cache for a maximum of a week.
                maxAgeSeconds: 7 * 24 * 60 * 60
            })
        ]
    })
);


// Cache tasks list.
workbox.routing.registerRoute(
    new RegExp('categories'),
    new workbox.strategies.NetworkFirst()
);

// Cache account
workbox.routing.registerRoute(
    new RegExp('account'),
    new workbox.strategies.NetworkFirst()
);

self.addEventListener('fetch', (event) => {
    // Clone the request to ensure it's safe to read when
    // adding to the Queue.
    if(!self.navigator.onLine) {
        const promiseChain = fetch(event.request.clone())
            .catch((err) => {
                return queue.pushRequest({request: event.request});
            });
        event.waitUntil(promiseChain);
    }


    console.log('am ajuns in fetch queue')

});

// Received PUSH notification handler.
self.addEventListener('push', ev => {
    const data = ev.data.json();
    console.log('Got push', data);
    self.registration.showNotification(data.title, {
        body: 'Hello, World!',
        icon: 'http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png'
    });
});


// workbox.precaching.precacheAndRoute([
//     {
//         "url": "javascripts/appInstaller.js",
//         "revision": "fe85f9e0a9b0a69e279de83ba164f64c"
//     },
//     {
//         "url": "javascripts/todos.js",
//         "revision": "1a96d04e7a4fd21d9774abe08ce068e2"
//     },
//     {
//         "url": "stylesheets/index.css",
//         "revision": "3c96aef6db25afc3f723860a76d52ff9"
//     },
//     {
//         "url": "stylesheets/style.css",
//         "revision": "fe1d749e11356dd62da733e20eecba63"
//     },
//     {
//         "url": "sw-register.js",
//         "revision": "5fd04795fc387b0f4db89ff743f40fe4"
//     }
// ]);

workbox.precaching.precacheAndRoute([]);
