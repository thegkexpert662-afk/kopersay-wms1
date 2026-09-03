// Kopersay Technologies - site cache registration + Google Analytics
(function () {
  // Google Analytics 4
  if (!window.__kopersayGA) {
    window.__kopersayGA = true;

    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-JTSZSZ29VY';
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-JTSZSZ29VY', {
      anonymize_ip: true
    });
  }

  // Keep Kopersay contact email directly below the phone number on the home page
  window.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname === '') {
      var contact = document.getElementById('contact');
      if (contact) {
        var email = contact.querySelector('.kopersay-contact-email');
        if (!email) {
          email = document.createElement('p');
          email.className = 'kopersay-contact-email';
          email.innerHTML = 'Email: <a href="mailto:contact@kopersay.in">contact@kopersay.in</a>';
        }

        var phone = contact.querySelector('.phone');
        if (phone) {
          phone.insertAdjacentElement('afterend', email);
        } else {
          var callButton = contact.querySelector('a[href^="tel:"]');
          if (callButton) {
            callButton.insertAdjacentElement('afterend', email);
          } else {
            contact.appendChild(email);
          }
        }
      }
    }
  });

  // Service worker cache
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
