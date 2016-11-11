'use strict';

importScripts('/static/sw/sw-cache.js');

self.addEventListener('install', function (event) {
  return event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function (event) {
  return event.waitUntil(self.clients.claim());
});