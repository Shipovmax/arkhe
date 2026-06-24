'use strict';

self.addEventListener('push', event => {
  const data = event.data?.json().catch?.(() => ({})) ?? {};
  const title = data.title || 'Arkhe';
  const body  = data.body  || '';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:      '/assets/icon-192.png',
      badge:     '/assets/icon-192.png',
      tag:       'arkhe-streak',
      renotify:  true,
      vibrate:   [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('/app.html') && 'focus' in c) return c.focus();
      }
      return clients.openWindow('/app.html');
    })
  );
});
