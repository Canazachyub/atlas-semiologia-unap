/* Atlas sin internet: guarda todo el atlas la primera vez y lo sirve desde el teléfono, la tablet o la PC.
   web.py rellena la versión y la lista de archivos en cada compilación; una versión nueva reemplaza la caché vieja. */
// varias apps comparten canazachyub.github.io: el nombre lleva la carpeta para no tocar las cachés de otra
const BASE = "atlas " + self.registration.scope + " ", CACHE = BASE + "20261020090441";
const NUCLEO = [
 "./",
 "fonts.css?v=20261020090441",
 "app.css?v=20261020090441",
 "datos.js?v=20261020090441",
 "app.js?v=20261020090441",
 "manifest.webmanifest",
 "icono-192.png",
 "icono-512.png",
 "fonts/fredoka-latin-ext.woff2",
 "fonts/fredoka-latin.woff2",
 "fonts/nunito-latin-ext.woff2",
 "fonts/nunito-latin.woff2",
 "img/mini/01.webp",
 "img/mini/02.webp",
 "img/mini/03.webp",
 "img/mini/04.webp",
 "img/mini/05.webp",
 "img/mini/06.webp",
 "img/mini/07.webp",
 "img/mini/08.webp",
 "img/mini/09.webp",
 "img/mini/10.webp",
 "img/mini/11.webp",
 "img/mini/12.webp",
 "img/mini/13.webp",
 "img/mini/14.webp",
 "img/mini/15.webp",
 "img/mini/16.webp",
 "img/mini/17.webp",
 "img/mini/18.webp",
 "img/mini/19.webp",
 "img/mini/20.webp"
];   // se guarda al instalar: la página abre rápido desde la primera visita
const RESTO = [
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
];     // láminas grandes: se guardan después, sin competir con lo que estás viendo

self.addEventListener("install", ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(NUCLEO)).then(() => self.skipWaiting()));
});

// la página pide guardar el resto cuando terminó de cargar; se bajan de a 3 y solo las que faltan
self.addEventListener("message", ev => {
  if (ev.data !== "guardar-resto") return;
  ev.waitUntil((async () => {
    const c = await caches.open(CACHE), falta = [];
    for (const u of RESTO) if (!(await c.match(u))) falta.push(u);
    for (let i = 0; i < falta.length; i += 3) await Promise.all(falta.slice(i, i + 3).map(u => c.add(u).catch(() => {})));
    let ok = 0; for (const u of RESTO) if (await c.match(u)) ok++;
    if (falta.length && ok === RESTO.length) (await self.clients.matchAll()).forEach(cl => cl.postMessage("atlas-completo"));
  })());
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
