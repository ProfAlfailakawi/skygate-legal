/* iPhone Duo markers: data-device (near-square screen), data-shell, data-widget-side.
   iPhone (ratio >= 1.7) and iPad (short side > 700) stay "other" and never change. */
(function () {
  var d = document.documentElement, s = window.screen;
  var a = Math.min(s.width, s.height), b = Math.max(s.width, s.height);
  d.setAttribute('data-device', a >= 440 && a <= 700 && b / a <= 1.48 ? 'duo' : 'other');
  var app = !!window.Capacitor || navigator.standalone === true ||
    (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
  d.setAttribute('data-shell', app ? 'app' : 'browser');
  function start() {
    var p = document.createElement('div');
    p.setAttribute('aria-hidden', 'true');
    p.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;' +
      'padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)';
    document.body.appendChild(p);
    function side() {
      var cs = getComputedStyle(p), l = parseFloat(cs.paddingLeft) || 0, r = parseFloat(cs.paddingRight) || 0;
      d.setAttribute('data-widget-side', l > r + 4 ? 'left' : r > l + 4 ? 'right' : 'none');
    }
    side();
    if (window.ResizeObserver) new ResizeObserver(side).observe(p);
    window.addEventListener('resize', function () { setTimeout(side, 120); });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
