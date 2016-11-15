'use strict';

importScripts('/static/sw/lib/sw-toolbox.js');

self.addEventListener('install', function (event) {
  return event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function (event) {
  return event.waitUntil(self.clients.claim());
});


const options = {
  networkTimeoutSeconds: 3,
  cache: {
    name: 'farmer-zheng-blog'
  }
};
toolbox.router.default = toolbox.fastest;

const imgReg = /(\.(png|jpg|jpeg|mp3|mp4|mpg|jpeg|eot|svg|ttf|woff|gif|woff2)$)/i;
const htmlReg = /(\.(html|htm)$)||\//i;

toolbox.router.get(imgReg, function (request) {
  return toolbox.cacheFirst(request, [], options);
});
toolbox.router.get(htmlReg, function (request) {
  return toolbox.networkFirst(request, [], options);
});