// City Nexa Networks — Service Worker
// Offline-first caching strategy for PWA support

const CACHE_VERSION = "v1";
const CACHE_NAME = `citynexa-${CACHE_VERSION}`;

// App shell resources to pre-cache on install
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/images/citynexa-logo.jpeg",
];

// ─── Install: pre-cache the app shell ────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  // Activate the new service worker immediately
  self.skipWaiting();
});

// ─── Activate: clean up old caches ──────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith("citynexa-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// ─── Fetch: route requests through the appropriate strategy ─────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Network-first for API calls — always try fresh data
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for static assets (images, fonts, CSS, JS bundles)
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigation requests (HTML pages): cache-first, fallback to network,
  // and ultimately serve the cached root page for offline support
  if (request.mode === "navigate") {
    event.respondWith(navigationHandler(request));
    return;
  }

  // Default: cache-first for everything else
  event.respondWith(cacheFirst(request));
});

// ─── Strategies ─────────────────────────────────────────────────────

/**
 * Cache-first: serve from cache if available, otherwise fetch from
 * network and store the response in the cache for next time.
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // If both cache and network fail, return a basic offline response
    return new Response("Offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

/**
 * Network-first: try the network, fall back to cache.
 * Best for API calls where freshness matters.
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return (
      cached ||
      new Response(JSON.stringify({ error: "Offline" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
}

/**
 * Navigation handler: try network first for pages, fall back to cache,
 * and as a last resort serve the cached root page so the SPA shell loads.
 */
async function navigationHandler(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Serve cached root page as a fallback for offline navigation
    const fallback = await caches.match("/");
    return (
      fallback ||
      new Response(
        "<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>",
        {
          status: 503,
          headers: { "Content-Type": "text/html" },
        }
      )
    );
  }
}

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Determine whether a request path points to a static asset that
 * benefits from aggressive caching.
 */
function isStaticAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$/i.test(
    pathname
  );
}
