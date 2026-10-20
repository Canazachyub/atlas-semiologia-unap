/* Atlas sin internet: guarda todo el atlas la primera vez y lo sirve desde el teléfono, la tablet o la PC.
   web.py rellena la versión y la lista de archivos en cada compilación; una versión nueva reemplaza la caché vieja. */
// varias apps comparten canazachyub.github.io: el nombre lleva la carpeta para no tocar las cachés de otra
const BASE = "atlas " + self.registration.scope + " ", CACHE = BASE + "20261020090104";
const ARCHIVOS = [
 "./",
 "fonts.css?v=20261020090104",
 "app.css?v=20261020090104",
 "datos.js?v=20261020090104",
 "app.js?v=20261020090104",
 "manifest.webmanifest",
 "icono-192.png",
 "icono-512.png",
 "fonts/fredoka-latin-ext.woff2",
 "fonts/fredoka-latin.woff2",
 "fonts/nunito-latin-ext.woff2",
 "fonts/nunito-latin.woff2",
 "img/01.webp",
 "img/01_2.webp",
 "img/01_3.webp",
 "img/02.webp",
 "img/02_2.webp",
 "img/02_3.webp",
 "img/03.webp",
 "img/03_2.webp",
 "img/03_3.webp",
 "img/04.webp",
 "img/04_2.webp",
 "img/04_3.webp",
 "img/05.webp",
 "img/05_2.webp",
 "img/05_3.webp",
 "img/06.webp",
 "img/06_2.webp",
 "img/06_3.webp",
 "img/07.webp",
 "img/07_2.webp",
 "img/07_3.webp",
 "img/08.webp",
 "img/08_2.webp",
 "img/08_3.webp",
 "img/09.webp",
 "img/09_2.webp",
 "img/09_3.webp",
 "img/10.webp",
 "img/10_2.webp",
 "img/10_3.webp",
 "img/11.webp",
 "img/11_2.webp",
 "img/11_3.webp",
 "img/12.webp",
 "img/12_2.webp",
 "img/12_3.webp",
 "img/13.webp",
 "img/13_2.webp",
 "img/13_3.webp",
 "img/14.webp",
 "img/14_2.webp",
 "img/14_3.webp",
 "img/15.webp",
 "img/15_2.webp",
 "img/15_3.webp",
 "img/16.webp",
 "img/16_2.webp",
 "img/16_3.webp",
 "img/17.webp",
 "img/17_2.webp",
 "img/17_3.webp",
 "img/18.webp",
 "img/18_2.webp",
 "img/18_3.webp",
 "img/19.webp",
 "img/19_2.webp",
 "img/19_3.webp",
 "img/20.webp",
 "img/20_2.webp",
 "img/20_3.webp"
];

self.addEventListener("install", ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", ev => {
  ev.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => (k.startsWith(BASE) || k.startsWith("atlas-2")) && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", ev => {
  const r = ev.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  // la página: primero la red (para recibir versiones nuevas), y sin internet la guardada
  if (r.mode === "navigate") {
    ev.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put("./", c)); return res; })
      .catch(() => caches.match("./").then(x => x || caches.match("index.html"))));
    return;
  }
  // lo demás: lo guardado, y si falta, la red (y se guarda para la próxima)
  ev.respondWith(caches.match(r).then(x => x || fetch(r).then(res => {
    if (res.ok) { const c = res.clone(); caches.open(CACHE).then(k => k.put(r, c)); }
    return res;
  })));
});
