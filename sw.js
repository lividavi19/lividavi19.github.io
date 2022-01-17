const staticCacheVersion = 0.1;
// const dynamicCacheVersion = 1.2;
const staticCacheName = `static-${staticCacheVersion}://lividavi19.github.io`;
// const dynamicCacheName = `dynamic-${dynamicCacheVersion}://lividavi19.github.io`;
const appShell = [
	`.`,
	`index.html`,
	`assets/css/main.css`,
	`js/base.jsassets/js/jquery.min.js`,
	`assets/js/jquery.scrolly.min.js`,
	`assets/js/browser.min.js`,
	`assets/js/breakpoints.min.js`,
	`assets/js/util.js`,
	`assets/js/main.js`,
	`img/icons/ic_192.png`,
	`img/icons/ic_512.png`
];

// install event
self.oninstall = e => {
	e.waitUntil(
		caches.open(staticCacheName).then(cache => {
			cache.addAll(appShell);
		})
	);
};

// activate event
self.onactivate = e => {
	e.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== staticCacheName && key !== dynamicCacheName)
				.map(key => caches.delete(key))
			);
		})
	);
};

// fetch event
self.onfetch = e => {
	e.respondWith(
		caches.match(e.request).then(cachedResponse => {
			return cachedResponse || fetch(e.request).then(fetchResponse => {
				return caches.open(`${dynamicCacheName}`).then(cache => {
					cache.put(e.request.url, fetchResponse.clone());
					return fetchResponse;
				});
			});
		})
	);
};