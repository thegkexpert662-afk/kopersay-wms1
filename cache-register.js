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
    window.gtag('config', 'G-JTSZSZ29VY', { anonymize_ip: true });
  }

  // Homepage contact email: keep it inside the glass contact card, directly below the phone number.
  function setupKopersayContactEmail() {
    if (!(window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname === '')) return;

    var contact = document.getElementById('contact');
    var contactBox = contact && contact.querySelector('.contact-box');
    var phone = contactBox && contactBox.querySelector('.phone');
    if (!contactBox) return;

    var email = contactBox.querySelector('.kopersay-contact-email') || document.querySelector('.kopersay-contact-email');
    if (!email) {
      email = document.createElement('p');
      email.className = 'kopersay-contact-email';
      email.innerHTML = '<span>Email:</span> <a href="mailto:contact@kopersay.in">contact@kopersay.in</a>';
    }

    // Force the email into the contact card and place it immediately after the phone.
    if (email.parentNode !== contactBox || (phone && email.previousElementSibling !== phone)) {
      email.remove();
      if (phone) phone.insertAdjacentElement('afterend', email);
      else contactBox.appendChild(email);
    }

    if (!document.getElementById('kopersay-contact-email-css')) {
      var style = document.createElement('style');
      style.id = 'kopersay-contact-email-css';
      style.textContent = '.contact-box .kopersay-contact-email{display:block!important;margin:10px 0 0!important;padding:0!important;color:#60728a!important;font-size:13px!important;font-weight:600!important;line-height:1.5!important;text-align:center!important}.contact-box .kopersay-contact-email span{color:#60728a!important}.contact-box .kopersay-contact-email a{color:#6545ed!important;font-weight:800!important;text-decoration:none!important}.contact-box .kopersay-contact-email a:hover{text-decoration:underline!important}@media(max-width:700px){.contact-box .kopersay-contact-email{font-size:12px!important;word-break:break-word!important}}';
      document.head.appendChild(style);
    }
  }

  window.addEventListener('DOMContentLoaded', setupKopersayContactEmail);
  window.addEventListener('load', setupKopersayContactEmail);
  setTimeout(setupKopersayContactEmail, 500);

  // Service worker cache
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(function (registration) {
        registration.update();
        console.log('Kopersay cache enabled:', registration.scope);
      })
      .catch(function (error) {
        console.warn('Kopersay cache registration failed:', error);
      });
  });
})();
