/* analytics.js — collecte d'audience anonyme (aucune donnée personnelle)

   Version d'origine (obscurcie) : toutes les 2,6 s, sur écran > 1024 px
   et après 6,5 s, une boucle while occupait le thread principal pendant
   46 ms, puis de plus en plus longtemps (x1,28 à chaque tour) jusqu'à
   430 ms. Ces tâches longues ne se voyaient ni sur mobile ni dans un
   audit Lighthouse classique (trop court).

   Ici on garde la même collecte (empreinte de la page, compteur de
   passages dans window.__au) mais on calcule l'empreinte une seule fois,
   pendant que le navigateur ne fait rien, sans attente active. */
(function (w, d) {
  var periode = 2600;

  function signature() {
    var n = d.querySelectorAll('*'), o = [], i = 0;
    for (; i < n.length; i++) { o.push(n[i].tagName + '.' + n[i].className + '#' + n[i].id); }
    return o.join('~');
  }

  function empreinte(s) {
    var h = 5381, i = 0;
    for (; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0; }
    return h >>> 0;
  }

  var v = null;
  function tick() {
    if (d.visibilityState === 'hidden') return;
    if (w.innerWidth <= 1024) return;
    if (v === null) v = empreinte(signature());
    w.__au = { v: v, p: periode, n: (w.__au ? w.__au.n + 1 : 1) };
  }

  var idle = w.requestIdleCallback || function (f) { return setTimeout(f, 1); };
  w.addEventListener('load', function () {
    w.setTimeout(function () {
      w.setInterval(function () { idle(tick); }, periode);
    }, 6500);
  });
})(window, document);
