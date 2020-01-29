/*
  If the browser supports service workers, it should support async/await as well.
*/

const publicKey =
  'BAominCht2MkXwMEPmlwz1XCvVAIx9L8o2VE0KnPzFmXJszpzFp_Alulz3npIwKbJIEr_5gLEeX0jWi7lIXIzCg';

$(document).ready(() => {
  // Register service worker if the browser supports.
  if ('serviceWorker' in navigator) {
    run().catch(error => console.error(error));
  }
});

async function run() {
  const registration = await navigator.serviceWorker.register('/sw.js');
  console.log('SW registered: ', registration);

  // console.log('Registering push');
  // const subscription = await registration.pushManager.subscribe({
  //   userVisibleOnly: true,
  //   applicationServerKey: urlBase64ToUint8Array(publicKey)
  // });
  // console.log('Registered push');
  //
  // console.log('Sending push');
  // await fetch('/subscribe', {
  //   method: 'POST',
  //   body: JSON.stringify(subscription),
  //   headers: {
  //     'content-type': 'application/json'
  //   }
  // });
  // console.log('Sent push');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
