self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("calc-cache").then(cache =>
      cache.addAll(["./","./index.html","./styles.css","./manifest.json"])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
