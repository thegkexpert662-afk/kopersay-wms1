// Kopersay Technologies - site cache registration
(function () {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(function (registration) {
        console.log('Kopersay cache enabled:', registration.scope);
      })
      .catch(function (error) {
        console.warn('Kopersay cache registration failed:', error);
      });
  });
})();
