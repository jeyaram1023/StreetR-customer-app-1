// js_notification.js
// NOTE: Push notifications require a service worker (e.g., sw.js) and a secure context (HTTPS).

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                // Here you would get the push subscription and save it to the user's profile in Supabase
                // This allows you to send notifications from your backend.
            } else {
                console.warn('Notification permission denied.');
            }
        });
    } else {
        console.error('This browser does not support desktop notification');
    }
}

// Ask for permission on first load after profile setup
document.getElementById('lets-go-btn').addEventListener('click', requestNotificationPermission);
