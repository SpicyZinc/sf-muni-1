const origin = 'http://rahulgaba.com/sf-muni'
const cacheFiles = [`${origin}/fixtures/arteries.json`,`${origin}/fixtures/freeways.json`, `${origin}/fixtures/neighborhoods.json`, `${origin}/fixtures/streets.json`];

self.addEventListener('install', (event) => {
  caches.delete('sf-muni');
  event.waitUntil(
    caches.open('sf-muni')
      .then((cache)=> {cache.addAll(cacheFiles); console.log('all added')})
      .then(() => self.skipWaiting())
    )
})

self.addEventListener('fetch', (event) => {
  if(cacheFiles.includes(event.request.url))
    return event.respondWith(caches.match(event.request));
  else return
})
