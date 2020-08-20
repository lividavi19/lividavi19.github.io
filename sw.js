const SW_VERSION = 0;
const STATIC_CACHE_NAME = `static://lividavi19.github.io-${SW_VERSION}`;
const APP_SHELL = [
	`.`,
	`index.html`,
	`css/base.css`,
	`js/base.js`,
	`img/icons/ic_192.png`,
	`img/icons/ic_512.png`
];

// install event
self.oninstall = e => {
	e.waitUntil(
		caches.open(STATIC_CACHE_NAME).then(cache => {
			cache.addAll(APP_SHELL);
		})
	);
};

// activate event
self.onactivate = e => {
	e.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== STATIC_CACHE_NAME)
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
				caches.open(`dynamic://lividavi19.github.io-0`).then(cache => {
					cache.put(e.request.url, fetchResponse.clone());
					return fetchResponse;
				});
			});
		})
	);
};
